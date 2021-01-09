# MfpcApi

## Transactions

- Place order flow:
  - Add order
  - Decrease discount code uses
  - Update user points

- User add discount code:
  - Update user discount codes
  - Decrease discount code uses

```mermaid
graph TD
	subgraph addDiscountCode [Add Discount Code]
		lockUsers2[Lock Users] --> updateUser2([Update user points]) --> lockDiscounts2[Lock Discounts] --> decreaseDiscount2([Decrease discount code uses]) --> unlockUsers2[Unlock Users] --> unlockDiscounts2[Unlock Discounts]
	end

	subgraph orderFlow [Order flow]
	lockOrders[Lock Orders] --> addOrder([Add order]) --> lockDiscounts[Lock Discounts] --> decreaseDiscount([Decrease discount code uses]) --> lockUsers[Lock Users] --> updateUser([Update user points]) --> unlockOrders[Unlock Orders] --> unlockDiscounts[Unlock Discounts] --> unlockUsers[Unlock Users]
	end
```