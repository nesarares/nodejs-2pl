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
		lockUsers2[Lock Users] 
		--> updateUser4([Check if user has discount])
		--> lockDiscounts2[Lock Discounts] 
		--> checkDiscount1([Check if discount code is valid]) 
		--> decreaseDiscount2([Decrease discount code uses]) 
		--> updateUser2([Update user discounts]) 
		--> unlockUsers2[Unlock Users] 
		--> unlockDiscounts2[Unlock Discounts]
	end

	subgraph orderFlow [Order flow]
		lockDiscounts[Lock Discounts] 
		--> checkDiscount2([Check if discount code is valid]) 
		--> lockProducts[Lock Products]
		--> checkProducts([Get all order products])
		--> lockOrders[Lock Orders] 
		--> addOrder([Add order]) 
		--> lockUsers[Lock Users] 
		--> updateUser([Update user points]) 
		--> decreaseDiscount([Decrease discount code uses]) 
		--> unlockDiscounts[Unlock Discounts] 
		--> unlockOrders[Unlock Orders] 
		--> unlockUsers[Unlock Users]
	end
```

## Deadlock case

- Place order (T1) and Add discount code (T2) at the same time:

```mermaid
graph LR
	a[T1 Lock discounts]-->b[T2 Lock users]-->c[...]-->d[T1 Request lock users]-->e[T2 Request lock discounts]
```