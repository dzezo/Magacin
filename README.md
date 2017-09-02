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
