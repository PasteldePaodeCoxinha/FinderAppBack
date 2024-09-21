# API do projeto FinderApp

# USUARIO

## Cadastro

### POST - ROTA: "/usuario/cadastro"

REQUISIÇÃO:

```
{
  "nome": string,
  "email": string,
  "senha": string,
  "datanascimento": string - (yyyy-mm-dd),
  "profissao": string,
  "escolaridade": string,
  "descricao": string
}
```

RETORNOS:
* 200
```
{
  "msg": "Cadastrado"
}
```

* 500
```
{
  "msg": error
}
```

## LISTA

### GET - ROTA: "/usuario/lista"

REQUISIÇÃO:
```
none
```

RETORNOS:
* 200
```
{
  "usuarios": [
      {
        "id": int,
        "nome": string,
        "email": string,
        "senha": string,
        "datanascimento": string - (yyyy-mm-ddT00:00:00.000Z),
        "profissao": string,
        "escolaridade": string,
        "descricao": string,
        "imgperfil": string -> (null por enquanto)
      },
      ...
  ]
}
```

* 500
```
{
  "msg": error
}
```
