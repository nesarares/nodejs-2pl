import { Injectable } from '@nestjs/common';
import { Utils } from 'src/utils/utils';

enum TransactionStatus {
  active = 'active',
  abort = 'abort',
  commit = 'commit',
}

export enum LockType {
  read = 'read',
  write = 'write',
}

interface Transaction {
  id: string;
  timestamp: Date;
  status: TransactionStatus;
}

interface Lock {
  id: string;
  type: LockType;
  object: string;
  transactionId: string;
}

interface WaitFor {
  id: string;
  lockType: LockType;
  lockObject: string;
  transactionWithLockId: string;
  transactionWaitingLockId: string;

  // Callbacks
  onAvailable: (lockId: string) => void;
  onRejected: () => void;
}

export class TransactionService {
  private transactions: Transaction[] = [];
  private locks: Lock[] = [];
	private waitFors: WaitFor[] = [];

	private static instance: TransactionService;
	public static getInstance() {
		if (!this.instance) {
			this.instance = new TransactionService();
		}
		return this.instance;
	}
	
	private constructor() {
		this.initDeadlockWatcher();
	}

	private initDeadlockWatcher() {
		// TODO: Implement deadlock watcher
	}

  private addLock(transactionId: string, type: LockType, object: string) {
    const id = Utils.generateId();
    this.locks.push({ id, type, object, transactionId });
    return id;
  }

  private canLock(lockType: LockType, object: string): boolean {
    // Get current locks on this object
    const locksOnObject = this.locks.filter((l) => l.object === object);
    if (locksOnObject.length > 0) {
      // There is at least one lock on this object
      if (lockType === LockType.read && !locksOnObject.some((lock) => lock.type === LockType.write)) {
        // Check if the requested lock is for read and all active locks are also read locks
        return true;
      } else {
        // Locks are incompatible, need to add to wait for graph
        return false;
      }
    } else {
      // There are no locks on this object, add and return execution
      return true;
    }
	}
	
	public addTransaction(transactionId: string) {
    this.transactions.push({
      id: transactionId,
      timestamp: new Date(),
      status: TransactionStatus.active,
    });
  }

  public requestLock(transactionId: string, lockType: LockType, object: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.canLock(lockType, object)) {
        // Add lock and return execution with lock id
        const lockId = this.addLock(transactionId, lockType, object);
        resolve(lockId);
      } else {
        // Add to wait for graph
        const transactionWithLockId = this.locks.filter((l) => l.object === object)[0].transactionId;
        this.waitFors.push({
          id: Utils.generateId(),
          lockObject: object,
          lockType,
          transactionWaitingLockId: transactionId,
          transactionWithLockId,
          onAvailable: (lockId: string) => resolve(lockId),
          onRejected: () => reject(),
        });
      }
    });
	}
	
	public removeLock(lockId: string) {
    const lock = this.locks.find((lock) => lock.id === lockId);
    this.locks = this.locks.filter((lock) => lock.id !== lockId);
    for (const waitFor of this.waitFors) {
      if (waitFor.lockObject === lock.object && waitFor.transactionWaitingLockId === lock.transactionId) {
        // Check if we can remove from wait-for graph
        if (this.canLock(waitFor.lockType, waitFor.lockObject)) {
          // Add the new lock and notify the waiting transaction
          const newLockId = this.addLock(waitFor.transactionWaitingLockId, waitFor.lockType, waitFor.lockObject);
          setTimeout(() => {
            // Notify asynchronously, after this function finishes
            waitFor.onAvailable(newLockId);
          });
        } else {
          // Change the transaction with lock from wait-for object
          const transactionWithLockId = this.locks.filter((l) => l.object === waitFor.lockObject)[0].transactionId;
          waitFor.transactionWithLockId = transactionWithLockId;
        }
      }
    }
  }
}
