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

{ success:false, msg:"Dobavljanje ulaznih faktura neuspesno" }
{ success: true, invoices: result }
```

```
/get/output/:username

Izlaz

{ success:false, msg:"Dobavljanje izlaznih faktura neuspesno" }
{ success: true, invoices: result }
```

```
/get/input/invoice/:invoiceId

Izlaz

{ success:false, msg:"Dobavljanje ulazne fakture neuspesno" }
{ success: true, invoice: result }
```

```
/get/output/invoice/:invoiceId

Izlaz
{ success:false, msg:"Dobavljanje izlazne fakture neuspesno" }
{ success: true, invoice: result }
```

```
/undo/input/invoice/:invoiceId

Izlaz

{ success:false, msg:"Ukidanje ulazne fakture neuspesno" }
{ success: true, msg:"Ukidanje ulazne fakture uspesno" }
```

```
/undo/output/invoice/:invoiceId

Izlaz

{ success:false, msg:"Ukidanje izlazne fakture neuspesno" }
{ success: true, msg:"Ukidanje izlazne fakture uspesno" }
```