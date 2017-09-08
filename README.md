### Magacin
#### USER API

```
/users/register

Ulaz

{
	"name": "Petar Petrovic",
	"email": "petarp@gmail.com",
	"username": "petar",
	"password": "petar123"
}

Izlaz

{ success: false, msg: 'Korisnik vec postoji.' }
{ success: false, msg: 'Neuspesno registrovanje.' }
{ success: true, msg: 'Korisnik registrovan.' }
```

```
/users/authenticate

Ulaz

{
	"username": "petar",
	"password": "petar123"
}

Izlaz

{ success: false, msg: 'Korisnik nije pronadjen.' }
{ success: false, msg: 'Pogresna Lozinka.' }
{
    "success": true,
    "token": "JWT eyJhbGciO...",
    "user": {
        "name": "Petar Petrovic",
        "username": "petar",
        "email": "petarp@gmail.com"
    }
}
```







#### INVOICE API

```
/add/input/:username

Ulaz

{
    "supplier": "CTC UNIT",
    "taxId": "100171520",
    "refNumber": "97 54 11080017",
    "invNumber": "FAOS-11080-0/17",
    "recvDate": "2017-09-20T00:00:00Z",
    "expDate": "2017-10-19T00:00:00Z",
    "items": [
        {
            "code": 50,
            "name": "MIKROFON",
            "quantity": 3,
            "purchaseP": 500,
            "sellingP": 800 
        }, ...
    ],
    "total": 1500
}

Izlaz

{ success: false, msg: "Fakturisanje neuspesno"}
{ success: true, msg: "Fakturisanje uspesno" }
```

```
/add/output/:username

Ulaz

{
    "purchaser": "MITAR",
    "invNumber": "ISECAK002",
    "issueDate": "2017-08-20T00:00:00Z",
    "items": [
        {
            "code": 50,
            "name": "MIKROFON",
            "quantity": 1,
            "sellingP": 800
        },...
    ],
    "total": 1250
}

Izlaz

{ success: false, msg: "Fakturisanje neuspesno"}
{ success: true, msg: "Fakturisanje uspesno" }
```

```
/get/input/:username

Izlaz

{ success: false, msg:"Dobavljanje ulaznih faktura neuspesno" }
{
    "success": true,
    "invoices": [
        {
            "expDate": "2017-10-19T00:00:00Z",
            "supplier": "CTC UNIT",
            "total": 32000,
            "id": "9",
            "recvDate": "2017-09-20T00:00:00Z"
        }
    ]
}
```

```
/get/output/:username

Izlaz

{ success: false, msg:"Dobavljanje izlaznih faktura neuspesno" }
{
    "success": true,
    "invoices": [
        {
            "id": "48",
            "purchaser": "STARACKI DOM",
            "total": 30000,
            "issueDate": "2017-08-20T00:00:00Z"
        }
    ]
}
```

```
/get/input/invoice/:invoiceId

Izlaz

{ success: false, msg:"Dobavljanje ulazne fakture neuspesno" }

{
    "success": true,
    "invoice": {
        "total": 32000,
        "refNumber": "97 54 11080017",
        "invNumber": "FAOS-11080-0/17",
        "taxId": "100171520",
        "supplier": "CTC UNIT",
        "recvDate": "2017-09-20T00:00:00Z",
        "expDate": "2017-10-19T00:00:00Z",
        "items": [
            {
                "name": "TRANZISTOR",
                "quantity": 10,
                "code": 4,
                "purchaseP": 2000,
                "sellingP": 3000
            },
            {
                "name": "MONITOR",
                "quantity": 1,
                "code": 2,
                "purchaseP": 10000,
                "sellingP": 15000
            },
            {
                "name": "CD",
                "quantity": 100,
                "code": 1,
                "purchaseP": 20,
                "sellingP": 30
            }
        ]
    }
}
```

```
/get/output/invoice/:invoiceId

Izlaz

{ success: false, msg:"Dobavljanje izlazne fakture neuspesno" }

{
    "success": true,
    "invoice": {
        "total": 30000,
        "invNumber": "ISECAK002",
        "purchaser": "STARACKI DOM",
        "issueDate": "2017-08-20T00:00:00Z",
        "items": [
            {
                "code": 4,
                "name": "TRANZISTOR",
                "quantity": 10,
                "sellingP": 3000
            }
        ]
    }
}
```

```
/undo/input/invoice/:invoiceId

Izlaz

{ success: false, msg:"Ukidanje ulazne fakture neuspesno" }
{ success: true, msg:"Ukidanje ulazne fakture uspesno" }
```

```
/undo/output/invoice/:invoiceId

Izlaz

{ success: false, msg:"Ukidanje izlazne fakture neuspesno" }
{ success: true, msg:"Ukidanje izlazne fakture uspesno" }
```






#### USER API

```
/get/item/:itemId

Izlaz

{ success: false, msg:"Dobavljanje neuspesno" }
{
    "success": true,
    "item": {
        "details": {
            "code": 1780,
            "quantity": 9,
            "purchaseP": 2000,
            "name": "NOKIA 1780",
            "sellingP": 3000
        },
        "inputs": [
            {
                "in": {
                    "quantity": 10,
                    "purchaseP": 2000,
                    "sellingP": 3000,
                    "timestamp": {
                        "low": 1418473206,
                        "high": 350
                    }
                },
                "details": {
                    "total": 20000,
                    "refNumber": "97 54 11080017",
                    "invNumber": "FAOS-11080-0/17",
                    "taxId": "100171520",
                    "supplier": "VITEL 3",
                    "recvDate": "2017-10-21T00:00:00Z",
                    "expDate": "2017-11-20T00:00:00Z"
                }
            }
        ],
        "outputs": [
            {
                "out": {
                    "quantity": 1,
                    "sellingP": 3500
                },
                "details": {
                    "total": 3500,
                    "invNumber": "ISECAK002",
                    "purchaser": "KUPAC 1",
                    "issueDate": "2017-08-20T00:00:00Z"
                }
            }
        ]
    }
}
```

```
/get/warehouse/:username

Izlaz

{ success: false, msg:"Dobavljanje artikala neuspesno" }
{
    "success": true,
    "items": [
        {
            "name": "GP AAA",
            "quantity": 198,
            "code": 50,
            "id": "83",
            "purchaseP": 50,
            "sellingP": 75
        },
        {
            "name": "GP 378",
            "quantity": 200,
            "code": 378,
            "id": "80",
            "purchaseP": 100,
            "sellingP": 150
        },
        {
            "name": "GP 377",
            "quantity": 200,
            "code": 377,
            "id": "82",
            "purchaseP": 100,
            "sellingP": 150
        }
    ]
}
```

```
/get/archive/:username

Izlaz

{ success: false, msg:"Dobavljanje arhiviranih artikala neuspesno" }
{
    "success": true,
    "items": [
        {
            "name": "NOKIA 1780",
            "quantity": 9,
            "code": 1780,
            "id": "40",
            "purchaseP": 2000,
            "sellingP": 3000
        }
    ]
}
```

```
/archive/item/:itemId

Izlaz

{ success: false, msg:"Arhiviranje neuspesno" }
{ success: true, msg:"Arhiviranje uspesno" }
```

```
/update/item/:itemId

Ulaz

Izlaz

```