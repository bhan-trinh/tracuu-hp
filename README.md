# Tuition Service Payment API

Prefix each route with `/api-hp/v1`

## Open Endpoints

Open endpoints require no Authentication.

* [Login](login.md) : `POST /login`

## Endpoints that require Authentication

Closed endpoints require a valid Token to be included in the header of the
request. A Token can be acquired from the Login view above.

### VNPT Money related

Each endpoint fetches from another partner API and displays information related to the Receipts:

* [Look Up Receipt](user/get.md) : `GET /vnptApi/look-up/[service-type]`
* [Look Up Receipt & Write To Database](user/put.md) : `GET /vnptApi/look-up-write/[service-type]`

Reference `service-type` from the company's list of external tuition services API.

### Receipt related

Each endpoint displays information inside the app database related to the Receipts:

* [Show Receipt By ID](user/get.md) : `GET /receipt/:id`
* [Show Receipt By Bill ID](user/get.md) : `GET /receipt/bill/:billId`

### Student related

Each endpoint displays information inside the app database related to the Students:

* [Show Student By ID](user/get.md) : `GET /student/:id`
* [Show Student By Receipt ID](user/get.md) : `GET /student/receipt/:receiptId`
