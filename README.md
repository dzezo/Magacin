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

{ success: false, msg: 'Username already taken.' }
{ success: false, msg: 'Failed to register user.' }
{ success: true, msg: 'User registered.' }
```

```
/users/authenticate

Ulaz

{
	"username": "petar",
	"password": "petar123"
}

Izlaz

{ success: false, msg: 'User not found.' }
{ success: false, msg: 'Wrong password.' }
{
    "success": true,
    "token": "JWT eyJhbGciO...",
    "user": {
        "id": 20,
        "name": "Petar Petrovic",
        "username": "petar",
        "email": "petarp@gmail.com"
    }
}
```
