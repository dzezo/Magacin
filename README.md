### Magacin

#### NEO4J




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
(POST) /invoices/add/input/:username

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
(POST) /invoices/add/output/:username

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
(GET) /invoices/get/input/:username

Izlaz

{ success: false, msg:"Dobavljanje ulaznih faktura neuspesno" }
{
    "success": true,
    "invoices": [
        {
            "expDate": "2017-10-19T00:00:00Z",
            "supplier": "CTC UNIT",
            "invNumber": "FAOS-11-0892/17",
            "total": 32000,
            "id": "9",
            "recvDate": "2017-09-20T00:00:00Z"
        }
    ]
}
```

```
(GET) /invoices/get/output/:username

Izlaz

{ success: false, msg:"Dobavljanje izlaznih faktura neuspesno" }
{
    "success": true,
    "invoices": [
        {
            "id": "48",
            "purchaser": "STARACKI DOM",
            "invNumber": "ISECAK003",
            "total": 30000,
            "issueDate": "2017-08-20T00:00:00Z"
        }
    ]
}
```

```
(GET) /invoices/get/input/invoice/:invoiceId

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

Ukoliko je faktura bez artikala

{
    "success": true,
    "invoice": {
        "total": 20000,
        "refNumber": "97 54 11080017",
        "invNumber": "FAOS-11080-0/17",
        "taxId": "100171520",
        "supplier": "CTC",
        "recvDate": "2017-09-20T00:00:00Z",
        "expDate": "2017-10-19T00:00:00Z",
        "items": null
    }
}
```

```
(GET) /invoices/get/output/invoice/:invoiceId

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

Ukoliko je faktura bez artikala

{
    "success": true,
    "invoice": {
        "total": 0,
        "invNumber": "ISECAK004",
        "purchaser": "KUPAC ler",
        "issueDate": "2017-08-20T00:00:00Z",
        "items": null
    }
}
```

```
(DELETE) /invoices/undo/input/invoice/:invoiceId

Izlaz

{ success: false, msg:"Ukidanje ulazne fakture neuspesno" }
{ success: true, msg:"Ukidanje ulazne fakture uspesno" }
```

```
(DELETE) /invoices/undo/output/invoice/:invoiceId

Izlaz

{ success: false, msg:"Ukidanje izlazne fakture neuspesno" }
{ success: true, msg:"Ukidanje izlazne fakture uspesno" }
```

```
(PUT) /invoices/update/input/invoice/:invoiceId

Ulaz

{
    supplier: "Ime dobavljaca",
    taxId: "PIB",
    refNumber: "Poziv na broj",
    invNumber: "Broj fakture",
    recvDate: "2017-08-20T00:00:00Z",
    expDate: "2017-08-20T00:00:00Z",
    total: 10000,
    items: [{
                "name": "MONITOR",
                "oldQuantity": 1,
                "quantity": 0,
                "code": 2,
                "purchaseP": 10000,
                "sellingP": 15000
            },...]
}

Izlaz
{ success: false, msg:"Ažuriranje fakture neuspešno" }
{ success: true, msg:"Ažuriranje fakture uspešno" }
```






#### ITEM API

```
(GET) /items/get/item/:itemId

Izlaz

{ success: false, msg:"Dobavljanje neuspesno" }

{
    "success": true,
    "item": {
        "details": {
            "code": 100,
            "quantity": 74,
            "purchaseP": 30,
            "name": "BATERIJA GP AAA",
            "sellingP": 50
        },
        "inputs": [
            {
                "in": {
                    "quantity": 100,
                    "purchaseP": 30,
                    "sellingP": 50,
                    "timestamp": {
                        "low": 2097451602,
                        "high": 350
                    }
                },
                "details": {
                    "id": "45",
                    "supplier": "GP",
                    "invNumber": "GP-P001"
                }
            }, itd ...
        ],
        "outputs": [
            {
                "out": {
                    "quantity": 2,
                    "sellingP": 50
                },
                "details": {
                    "id": "128",
                    "purchaser": "RADNJA1",
                    "invNumber": "ISECAK004",
                    "issueDate": "2017-09-05T00:00:00Z"
                }
            }, itd...
        ]
    }
}

*U slucaju da nema output vraca prazan niz
```

```
(GET) /items/get/warehouse/:username

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
(GET) /items/get/archive/:username

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
(DELETE) /items/archive/item/:itemId

Izlaz

{ success: false, msg:"Arhiviranje neuspesno" }
{ success: true, msg:"Arhiviranje uspesno" }
```

```
(PUT) /items/update/item/:itemId

Ulaz

{
    "newCode": "3310",
    "newName": "Nokia 3310"
}

Izlaz

{ success: false, msg:"Azuriranje neuspesno" }
{ success: true, msg:"Azuriranje uspesno", item: updatedItem }
*Vraca azurirani artikal

```



#### REDIS










#### SUPPLIER API


```
(POST) /suppliers/add/:username

ulaz
{
    "name": "VOX",
    "taxId": "134654122"
}

izlaz
{ "success": false, "msg": "Dodavanje dobavljaca neuspesno" }
{ "success": false, "msg": "Dobavljac vec postoji" }
{ "success": true, "msg": "Dodavanje dobavljaca uspesno" }

```

```
(POST) /suppliers/invoice/add/:username

ulaz
{
    "name": "VOX",
    "taxId": "134654122"
}

izlaz
{ "success": false }
{ "success": true }

```

```
(GET) /suppliers/search/:search/user/:username

izlaz za input ( v )
{
    "success": true,
    "suggestion": [
        "VOX",
        "VITEL"
    ]
}
```

```
(GET) /suppliers/get/:name/user/:username

izlaz
{
    "success": true,
    "supplier": {
        "name": "VOX",
        "taxId": "134654122",
        "collabCount": "3"
    }
}
```

```
(GET) /suppliers/user/:username

izlaz
{
    "success": true,
    "suppliers": [
        {
            "name": "DUDI",
            "taxId": "944654122",
            "collabCount": "1"
        },
        {
            "name": "GP",
            "taxId": "354654122",
            "collabCount": "1"
        },
        {
            "name": "VITEL",
            "taxId": "344654122",
            "collabCount": "1"
        },
        {
            "name": "VOX",
            "taxId": "134654122",
            "collabCount": "3"
        },
        {
            "name": "CTC",
            "taxId": "244654122",
            "collabCount": "1"
        }
    ]
}
```

```
(DELETE) /suppliers/delete/:name/user/:username

izlaz

{ success: false, msg: "Brisanje neuspesno" }
{ success: true, msg: "Brisanje uspesno" }

* Instant brisanje (za tabelu)
```

```
(DELETE) /suppliers/undo/:name/user/:username

izlaz

{ "success": false }
{ "success": true }

*Brise dobavljaca samo ukoliko nije imao saradnju pre toga 
```




#### WAREHOUSE API

```
(POST) /warehouses/add/:username

ulaz
{
    "items": [
        {
            "code": 500,
            "name": "PANASONIC KT500",
            "purchaseP": 1000,
            "sellingP": 2000    
        },
        {
            "code": 501,
            "name": "PANASONIC BEZICNI",
            "purchaseP": 2000,
            "sellingP": 3000
        },
        {
            "code": 750,
            "name": "ALCATEL 750",
            "purchaseP": 3000,
            "sellingP": 4000    
        },
        {
            "code": 1780,
            "name": "NOKIA 1780",
            "purchaseP": 2500,
            "sellingP": 3500
        }
    ]
}

izlaz
{ success: false }
{ success: true }

```

```
(GET) /warehouses/search/:search/user/:username

izlaz
{ success: false, error: err }
{ success: true, suggestion: [suggestions] }

```

```
(GET) /warehouses/code/:code/user/:username

izlaz
{ success: false, error: err }

{
    "success": true,
    "item": {
        "code": "500",
        "name": "PANASONIC KT500",
        "purchaseP": "1000",
        "sellingP": "2000",
        "count": "1"
    }
}
```

```
(GET) /warehouses/name/:name/user/:username

izlaz
{ success: false, error: err }

{
    "success": true,
    "item": {
        "code": "500",
        "name": "PANASONIC KT500",
        "purchaseP": "1000",
        "sellingP": "2000",
        "count": "1"
    }
}
```

```
* poziv kada se artikal uklanja iz magacina
* name = ime artikla
(DELETE) /warehouses/delete/:name/user/:username

izlaz
{ success: false }
{ success: true }

```

```
* poziv kada se ponistava artikal
(PUT) /warehouses/undo/user/:username

izlaz
{ success: false }
{ success: true }

```

```
(PUT) /warehouses/update/:name/user/:username

ulaz
{
    "newCode": "3310",
    "newName": "Nokia 3310"
}

izlaz
{ success: false }
{ success: true }

```