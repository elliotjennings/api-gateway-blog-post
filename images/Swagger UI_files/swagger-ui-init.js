
window.onload = function() {
  // Build a system
  var url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  var options = {
  "swaggerDoc": {
    "info": {
      "title": "Phoenix TOT",
      "version": "1.0.0",
      "description": "This API has been created to connect a React frontend and a microservice (containing the algorithm) to a relational database. To do this, the API has been created using Node.js, Express and Sequelize.\n\n The routes created are stated below with the instructions of which parameters are required and which are optional. For path and query parameters these are marked with a red asterisks. For body parameters, you can have a look at the model tab which will use the red asterisks next to the individual fields rather than the body as a whole. \n\n The API has been integrated with cognito to authenticate users and the authorisation is based on the user attribute 'isAdmin' - this is adaptable to allow visiting officer to be given temporary access to manager permissons.\n\n In addition to this, there will be an AWS API gateway which sits in front of this API to allow a single entry point to the microservices and allow for professionally hardening in terms of security. It will authenticate any user trying to interact with the application at a higher level as well as support other configuration setting such as throttling.\n\n At the bottom of this Swagger document there is a table for each model. This outlines the schema for each table in the database, again this includes an asterisks next to the required fields on creation. Each model has been created with a primary key and an id. This additional id has been created due to the want to persist data, and potentially run the TOT with historic data. Each table has been designed so that they have audit dates (‘auditDateFrom’ and ‘auditDateTo’). This allows all data to persist but remove it from the current scope using these reference points.\n\n When a new instance is created, the values of these columns are automatically updated. The current time and date is set as ‘auditDateFrom’ and 3999-12-12 is set as ‘auditDateTo’ by default. The latter is simply an arbitrary time in the future.\n\n When an instance is updated, the old version has the ‘auditDateTo’ column updated to the current time and date and a new instance is created as above.\n\n When an instance is deleted, the old version is updated in the same fashion as update, but a new instance is not created.\n\n Using the audit columns to query the data:\n 1. Leave blank to gather all versions of the data,\n 2. Enter the ‘auditDateFrom’ to get all data after this point - enter keyword ‘now’ to get the exact time and date,\n\n 3. Enter auditDateTo to get all the date up until this point - enter keyword ‘now’ to get the exact time and date,\n 4. If both are filled the data from between this period is called.\n\n The use of these audit columns is to allow us to re-run the algorithm with historic data as well as see where changes have been made. This does add a level of complexity to the interaction with the database and the API – simple update and delete commands now have to be create new instances, as seen through the service files. The positives, however, outweigh the negatives in this scenario through the ability to see the data over time and the interactions that have been made."
    },
    "servers": [
      "http://localhost:3001"
    ],
    "basePath": "/api/v1/",
    "swagger": "2.0",
    "paths": {
      "/algorithms": {
        "get": {
          "tags": [
            "Algorithm"
          ],
          "summary": "Get all Employee information needed by the Algorithm",
          "description": "This is queried with both the 'auditDateTo' and 'auditDateFrom' parameters to allow for the data to be called at a specific point in time",
          "parameters": [
            {
              "name": "auditDateFrom",
              "description": "date from",
              "in": "query",
              "type": "string"
            },
            {
              "name": "auditDateTo",
              "description": "date until",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        }
      },
      "/baselocations": {
        "get": {
          "tags": [
            "BaseLocation - Admin only"
          ],
          "summary": "Get all BaseLocations",
          "parameters": [
            {
              "name": "auditDateFrom",
              "description": "date from",
              "in": "query",
              "type": "string"
            },
            {
              "name": "auditDateTo",
              "description": "date until",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "post": {
          "tags": [
            "BaseLocation - Admin only"
          ],
          "summary": "Create a BaseLocation",
          "description": "The 'baseLocationPK', 'baseLocationId', 'dateTo', and 'dateFrom' will all be generated automatically.",
          "parameters": [
            {
              "name": "base location",
              "description": "base location object",
              "in": "body",
              "required": true,
              "schema": {
                "$ref": "#/definitions/BaseLocation"
              }
            }
          ],
          "responses": {
            "201": {
              "description": "Created"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        }
      },
      "/baselocations/me": {
        "get": {
          "tags": [
            "BaseLocation"
          ],
          "summary": "Get current user's BaseLocation",
          "description": "This only returns the BaseLocation that is active in the current time scope.",
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "put": {
          "tags": [
            "BaseLocation"
          ],
          "summary": "Update current user's BaseLocation",
          "description": "It is only possible to update:\n 1. 'currentBaseLocation',\n 2. 'previousBaseLocation',\n 3. 'baseLocationNode'",
          "parameters": [
            {
              "name": "base location fields",
              "description": "base location fields for update",
              "in": "body",
              "required": true,
              "schema": {
                "type": "object",
                "properties": {
                  "currentBaseLocation": {
                    "type": "string"
                  },
                  "previousBaseLocation": {
                    "type": "string"
                  },
                  "baseLocationNode": {
                    "type": "integer"
                  }
                },
                "example": {
                  "currentBaseLocation": "Home"
                }
              }
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        }
      },
      "/baselocations/bulk": {
        "post": {
          "tags": [
            "BaseLocation - Admin only"
          ],
          "summary": "Create multiple BaseLocations",
          "description": "The 'baseLocationPK', 'baseLocationId', 'dateTo', and 'dateFrom' will all be generated automatically.",
          "parameters": [
            {
              "name": "base locations",
              "description": "array of base location objects",
              "in": "body",
              "required": true,
              "schema": {
                "type": "array",
                "items": {
                  "$ref": "#/definitions/BaseLocation"
                }
              }
            }
          ],
          "responses": {
            "201": {
              "description": "Created"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        }
      },
      "/baselocations/{id}": {
        "get": {
          "tags": [
            "BaseLocation - Admin only"
          ],
          "summary": "Get a BaseLocation",
          "parameters": [
            {
              "name": "id",
              "description": "base location's id",
              "in": "path",
              "required": true,
              "type": "integer"
            },
            {
              "name": "auditDateFrom",
              "description": "date from",
              "in": "query",
              "type": "string"
            },
            {
              "name": "auditDateTo",
              "description": "date until",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "put": {
          "tags": [
            "BaseLocation - Admin only"
          ],
          "summary": "Update a BaseLocation",
          "description": "It is only possible to update:\n 1. 'currentBaseLocation',\n 2. 'previousBaseLocation',\n 3. 'baseLocationNode' and,\n 4. 'employeeId'",
          "parameters": [
            {
              "name": "id",
              "description": "base location's id",
              "in": "path",
              "required": true,
              "type": "integer"
            },
            {
              "name": "base location fields",
              "description": "base location fields for update",
              "in": "body",
              "required": true,
              "schema": {
                "type": "object",
                "properties": {
                  "currentBaseLocation": {
                    "type": "string"
                  },
                  "previousBaseLocation": {
                    "type": "string"
                  },
                  "baseLocationNode": {
                    "type": "integer"
                  },
                  "employeeId": {
                    "type": "integer reference Employees (employeeId)"
                  }
                },
                "example": {
                  "currentBaseLocation": "Home"
                }
              }
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "delete": {
          "tags": [
            "BaseLocation - Admin only"
          ],
          "summary": "Delete a BaseLocation",
          "parameters": [
            {
              "name": "id",
              "description": "base location's id",
              "in": "path",
              "required": true,
              "type": "integer"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            }
          }
        }
      },
      "/benefitcoverages/types": {
        "get": {
          "tags": [
            "BenefitCoverage"
          ],
          "summary": "Get BenefitCoverage types",
          "description": "This returns a JSON with all benefitCoverage types with the values as false. This is to be used for populating an unselected checkbox on the frontend.",
          "responses": {
            "200": {
              "description": "OK"
            },
            "404": {
              "description": "Not found"
            }
          }
        }
      },
      "/benefitcoverages": {
        "get": {
          "tags": [
            "BenefitCoverage - Admin only"
          ],
          "summary": "Get All BenefitCoverages",
          "parameters": [
            {
              "name": "auditDateFrom",
              "description": "date from",
              "in": "query",
              "type": "string"
            },
            {
              "name": "auditDateTo",
              "description": "date until",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "post": {
          "tags": [
            "BenefitCoverage - Admin only"
          ],
          "summary": "Create a BenefitCoverage",
          "description": "The 'benefitCoveragePK', 'benefitCoverageId', 'dateTo', and 'dateFrom' will all be generated automatically.",
          "parameters": [
            {
              "name": "benefit coverage",
              "description": "benefit coverage object",
              "in": "body",
              "required": true,
              "schema": {
                "$ref": "#/definitions/BenefitCoverage"
              }
            }
          ],
          "responses": {
            "201": {
              "description": "Created"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        }
      },
      "/benefitcoverages/me": {
        "get": {
          "tags": [
            "BenefitCoverage"
          ],
          "summary": "Get the current user's BenefitCoverage",
          "description": "This only returns the BenefitCoverage that is active in the current time scope.",
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "put": {
          "tags": [
            "BenefitCoverage"
          ],
          "summary": "Update current user's BenefitCoverage",
          "description": "It is only possible to update:\n 1. 'ca',\n 2. 'esa,\n 3. 'hb',\n 4. 'hppa',\n 5. 'hpwa',\n 6. 'hspa',\n 7. 'hswa',\n 8. 'jsa',\n 9. 'pc',\n 10. 'pip',\n 11. 'spc',\n 12. 'uc',\n 13. 'employeeId'",
          "parameters": [
            {
              "name": "benefit coverage fields",
              "description": "benefit coverage fields for update",
              "in": "body",
              "required": true,
              "schema": {
                "type": "object",
                "properties": {
                  "ca": {
                    "type": "boolean"
                  },
                  "esa": {
                    "type": "boolean"
                  },
                  "hb": {
                    "type": "boolean"
                  },
                  "hppa": {
                    "type": "boolean"
                  },
                  "hpwa": {
                    "type": "boolean"
                  },
                  "hspa": {
                    "type": "boolean"
                  },
                  "hswa": {
                    "type": "boolean"
                  },
                  "jsa": {
                    "type": "boolean"
                  },
                  "pc": {
                    "type": "boolean"
                  },
                  "pip": {
                    "type": "boolean"
                  },
                  "spc": {
                    "type": "boolean"
                  },
                  "uc": {
                    "type": "boolean"
                  },
                  "employeeId": {
                    "type": "integer reference Employees (employeeId)"
                  }
                },
                "example": {
                  "ca": false,
                  "pip": false
                }
              }
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        }
      },
      "/benefitcoverages/bulk": {
        "post": {
          "tags": [
            "BenefitCoverage - Admin only"
          ],
          "summary": "Create multiple BenefitCoverage",
          "description": "The 'benefitCoveragePK', 'benefitCoverageId', 'dateTo', and 'dateFrom' will all be generated automatically.",
          "parameters": [
            {
              "name": "benefit coverages",
              "description": "array of benefit coverage objects",
              "in": "body",
              "required": true,
              "schema": {
                "type": "array",
                "items": {
                  "$ref": "#/definitions/BenefitCoverage"
                }
              }
            }
          ],
          "responses": {
            "201": {
              "description": "Created"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        }
      },
      "/benefitcoverages/{id}": {
        "get": {
          "tags": [
            "BenefitCoverage - Admin only"
          ],
          "summary": "Get a BenefitCoverage",
          "parameters": [
            {
              "name": "id",
              "description": "benefit coverage's id",
              "in": "path",
              "required": true,
              "type": "integer"
            },
            {
              "name": "auditDateFrom",
              "description": "date from",
              "in": "query",
              "type": "string"
            },
            {
              "name": "auditDateTo",
              "description": "date until",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "put": {
          "tags": [
            "BenefitCoverage - Admin only"
          ],
          "summary": "Update a BaseLocation",
          "description": "It is only possible to update:\n 1. 'ca',\n 2. 'esa,\n 3. 'hb',\n 4. 'hppa',\n 5. 'hpwa',\n 6. 'hspa',\n 7. 'hswa',\n 8. 'jsa',\n 9. 'pc',\n 10. 'pip',\n 11. 'spc',\n 12. 'uc',\n 13. 'employeeId'",
          "parameters": [
            {
              "name": "id",
              "description": "benefit coverage's id",
              "in": "path",
              "required": true,
              "type": "integer"
            },
            {
              "name": "benefit coverage fields",
              "description": "benefit coverage fields for update",
              "in": "body",
              "required": true,
              "schema": {
                "type": "object",
                "properties": {
                  "ca": {
                    "type": "boolean"
                  },
                  "esa": {
                    "type": "boolean"
                  },
                  "hb": {
                    "type": "boolean"
                  },
                  "hppa": {
                    "type": "boolean"
                  },
                  "hpwa": {
                    "type": "boolean"
                  },
                  "hspa": {
                    "type": "boolean"
                  },
                  "hswa": {
                    "type": "boolean"
                  },
                  "jsa": {
                    "type": "boolean"
                  },
                  "pc": {
                    "type": "boolean"
                  },
                  "pip": {
                    "type": "boolean"
                  },
                  "spc": {
                    "type": "boolean"
                  },
                  "uc": {
                    "type": "boolean"
                  },
                  "employeeId": {
                    "type": "integer reference Employees (employeeId)"
                  }
                },
                "example": {
                  "ca": false,
                  "pip": false
                }
              }
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "delete": {
          "tags": [
            "BenefitCoverage - Admin only"
          ],
          "summary": "Delete a BenefitCoverage",
          "parameters": [
            {
              "name": "id",
              "description": "benefit coverage's id",
              "in": "path",
              "required": true,
              "type": "integer"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            }
          }
        }
      },
      "/cases": {
        "get": {
          "tags": [
            "Case - Admin only"
          ],
          "summary": "Get all Cases",
          "parameters": [
            {
              "name": "auditDateFrom",
              "description": "date from",
              "in": "query",
              "type": "string"
            },
            {
              "name": "auditDateTo",
              "description": "date until",
              "in": "query",
              "type": "string"
            },
            {
              "name": "isReserve",
              "description": "true or false to get either the reserve or non reserve cases",
              "in": "query",
              "type": "boolean"
            },
            {
              "name": "isAbandoned",
              "description": "true to get reserve cases, false to get non-reserve cases",
              "in": "query",
              "type": "boolean"
            },
            {
              "name": "reservedBy",
              "description": "id of employee who reserved the case",
              "in": "query",
              "type": "integer"
            },
            {
              "name": "abandonedBy",
              "description": "id of employee who abandoned the case",
              "in": "query",
              "type": "integer"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "post": {
          "tags": [
            "Case - Admin only"
          ],
          "summary": "Create a Case",
          "description": "The 'casePK', 'caseId', 'dateTo', and 'dateFrom' will all be generated automatically. If the case is abandoned or reserved then the abandonedBy or reservedBy field is automatically filled with the employeeId and a comment is requested.",
          "parameters": [
            {
              "name": "case",
              "description": "case object",
              "in": "body",
              "required": true,
              "schema": {
                "$ref": "#/definitions/Case"
              }
            }
          ],
          "responses": {
            "201": {
              "description": "Created"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        }
      },
      "/cases/bulk": {
        "post": {
          "tags": [
            "Case - Admin only"
          ],
          "summary": "Create multiple Cases",
          "description": "The 'casePK', 'caseId', 'dateTo', and 'dateFrom' will all be generated automatically. If the case is abandoned or reserved then the abandonedBy or reservedBy field is automatically filled with the employeeId and a comment is requested.",
          "parameters": [
            {
              "name": "cases",
              "description": "array of case objects",
              "in": "body",
              "required": true,
              "schema": {
                "type": "array",
                "items": {
                  "$ref": "#/definitions/Case"
                }
              }
            }
          ],
          "responses": {
            "201": {
              "description": "Created"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        }
      },
      "/cases/{id}": {
        "get": {
          "tags": [
            "Case - Admin only"
          ],
          "summary": "Get a Case",
          "parameters": [
            {
              "name": "id",
              "description": "case's id",
              "in": "path",
              "required": true,
              "type": "integer"
            },
            {
              "name": "auditDateFrom",
              "description": "date from",
              "in": "query",
              "type": "string"
            },
            {
              "name": "auditDateTo",
              "description": "date until",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "put": {
          "tags": [
            "Case"
          ],
          "summary": "Update a Cases",
          "description": "It is only possible to update:\n 1. 'caseNumber',\n 2. 'benefitType',\n 3. 'postcode',\n 4. 'longitude',\n 5. 'latitude',\n 6. 'localAuthority',\n 7. 'isReserve',\n 8. 'isAbandoned' and,\n 9. 'comment' and,\n 10. 'caseNode'",
          "parameters": [
            {
              "name": "id",
              "description": "case's id",
              "in": "path",
              "required": true,
              "type": "integer"
            },
            {
              "name": "case fields",
              "description": "case fields for update",
              "in": "body",
              "required": true,
              "schema": {
                "type": "object",
                "properties": {
                  "caseNumber": {
                    "type": "string"
                  },
                  "benefitType": {
                    "type": "string"
                  },
                  "postcode": {
                    "type": "string"
                  },
                  "longitude": {
                    "type": "string"
                  },
                  "latitude": {
                    "type": "string"
                  },
                  "localAuthority": {
                    "type": "string"
                  },
                  "isReserve": {
                    "type": "boolean"
                  },
                  "isAbandoned": {
                    "type": "boolean"
                  },
                  "comment": {
                    "type": "string"
                  },
                  "caseNode": {
                    "type": "integer"
                  }
                },
                "example": {
                  "isReserve": true
                }
              }
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "delete": {
          "tags": [
            "Case - Admin only"
          ],
          "summary": "Delete a Case",
          "parameters": [
            {
              "name": "id",
              "description": "case's id",
              "in": "path",
              "required": true,
              "type": "integer"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            }
          }
        }
      },
      "/employees": {
        "get": {
          "tags": [
            "Employee - Admin only"
          ],
          "summary": "Get All Employees",
          "parameters": [
            {
              "name": "auditDateFrom",
              "description": "date from",
              "in": "query",
              "type": "string"
            },
            {
              "name": "auditDateTo",
              "description": "date until",
              "in": "query",
              "type": "string"
            },
            {
              "name": "teamId",
              "description": "id of the team of the employees",
              "in": "query",
              "type": "integer reference Teams (teamId)"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "post": {
          "tags": [
            "Employee - Admin only"
          ],
          "summary": "Create an Employee",
          "description": "The 'employeePK', 'employeeId', 'dateTo', and 'dateFrom' will all be generated automatically.",
          "parameters": [
            {
              "name": "employee",
              "description": "employee object",
              "in": "body",
              "required": true,
              "schema": {
                "$ref": "#/definitions/Employee"
              }
            }
          ],
          "responses": {
            "201": {
              "description": "Created"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        }
      },
      "/employees/me": {
        "get": {
          "tags": [
            "Employee"
          ],
          "summary": "Get the current Employee",
          "description": "This only returns the Employee information that is active in the current time scope.",
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "put": {
          "tags": [
            "Employee"
          ],
          "summary": "Update current Employee",
          "description": "It is only possible to update:\n 1. 'firstName',\n 2. 'lastName',\n 3. 'email',\n 4. 'role',\n 5. 'isManager',\n 6. 'isAdmin',\n 7. 'workDays',\n 8. 'workHours',\n 9. 'transport',\n 10. 'teamId' and,\n 11. 'officeLocationId'",
          "parameters": [
            {
              "name": "employee fields",
              "description": "employee fields for update",
              "in": "body",
              "required": true,
              "schema": {
                "type": "object",
                "properties": {
                  "firstName": {
                    "type": "string"
                  },
                  "lastName": {
                    "type": "string"
                  },
                  "email": {
                    "type": "string"
                  },
                  "role": {
                    "type": "string"
                  },
                  "isManager": {
                    "type": "boolean"
                  },
                  "isAdmin": {
                    "type": "boolean"
                  },
                  "workDays": {
                    "type": "integer"
                  },
                  "workHours": {
                    "type": "integer"
                  },
                  "transport": {
                    "type": "string"
                  },
                  "teamId": {
                    "type": "integer reference Teams (teamId)"
                  },
                  "officeLocationId": {
                    "type": "integer reference OfficeLocations (officeLocationId)"
                  }
                },
                "example": {
                  "workHours": 6
                }
              }
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        }
      },
      "/employees/bulk": {
        "post": {
          "tags": [
            "Employee - Admin only"
          ],
          "summary": "Create multiple Employees",
          "description": "The 'employeePK', 'employeeId', 'dateTo', and 'dateFrom' will all be generated automatically.",
          "parameters": [
            {
              "name": "employees",
              "description": "array of employee objects",
              "in": "body",
              "required": true,
              "schema": {
                "type": "array",
                "items": {
                  "$ref": "#/definitions/Employee"
                }
              }
            }
          ],
          "responses": {
            "201": {
              "description": "Created"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        }
      },
      "/employees/{id}": {
        "get": {
          "tags": [
            "Employee - Admin only"
          ],
          "summary": "Get an Employee",
          "parameters": [
            {
              "name": "id",
              "description": "employee's id",
              "in": "path",
              "required": true,
              "type": "integer"
            },
            {
              "name": "auditDateFrom",
              "description": "date from",
              "in": "query",
              "type": "string"
            },
            {
              "name": "auditDateTo",
              "description": "date until",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "put": {
          "tags": [
            "Employee - Admin only"
          ],
          "summary": "Update an Employee",
          "description": "It is only possible to update:\n 1. 'firstName',\n 2. 'lastName',\n 3. 'email',\n 4. 'role',\n 5. 'isManager',\n 6. 'isAdmin',\n 7. 'workDays',\n 8. 'workHours',\n 9. 'transport',\n 10. 'teamId' and,\n 11. 'officeLocationId'",
          "parameters": [
            {
              "name": "id",
              "description": "employee's id",
              "in": "path",
              "required": true,
              "type": "integer"
            },
            {
              "name": "employee fields",
              "description": "employee fields for update",
              "in": "body",
              "required": true,
              "schema": {
                "type": "object",
                "properties": {
                  "firstName": {
                    "type": "string"
                  },
                  "lastName": {
                    "type": "string"
                  },
                  "email": {
                    "type": "string"
                  },
                  "role": {
                    "type": "string"
                  },
                  "isManager": {
                    "type": "boolean"
                  },
                  "isAdmin": {
                    "type": "boolean"
                  },
                  "workDays": {
                    "type": "integer"
                  },
                  "workHours": {
                    "type": "integer"
                  },
                  "transport": {
                    "type": "string"
                  },
                  "teamId": {
                    "type": "integer reference Teams (teamId)"
                  },
                  "officeLocationId": {
                    "type": "integer reference OfficeLocations (officeLocationId)"
                  }
                },
                "example": {
                  "workHours": 6
                }
              }
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "delete": {
          "tags": [
            "Employee - Admin only"
          ],
          "summary": "Delete an Employee",
          "parameters": [
            {
              "name": "id",
              "description": "employee's id",
              "in": "path",
              "required": true,
              "type": "integer"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            }
          }
        }
      },
      "/employees/{id}/unavailabledates": {
        "get": {
          "tags": [
            "Employee - Admin only"
          ],
          "summary": "Get an Employee's unavailable dates",
          "description": "This is the collection of leave periods and schedules which have dates attributed to them.",
          "parameters": [
            {
              "name": "id",
              "description": "employee's id",
              "in": "path",
              "required": true,
              "type": "integer"
            },
            {
              "name": "auditDateFrom",
              "description": "date from",
              "in": "query",
              "type": "string"
            },
            {
              "name": "auditDateTo",
              "description": "date until",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        }
      },
      "/employees/unavailabledates/me": {
        "get": {
          "tags": [
            "Employee"
          ],
          "summary": "Get current Employee's unavailable dates",
          "description": "This is the collection of leave periods and schedules which have dates attributed to them.",
          "parameters": [
            {
              "name": "auditDateFrom",
              "description": "date from",
              "in": "query",
              "type": "string"
            },
            {
              "name": "auditDateTo",
              "description": "date until",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        }
      },
      "/homelocations": {
        "get": {
          "tags": [
            "HomeLocation - Admin only"
          ],
          "summary": "Get all HomeLocations",
          "parameters": [
            {
              "name": "auditDateFrom",
              "description": "date from",
              "in": "query",
              "type": "string"
            },
            {
              "name": "auditDateTo",
              "description": "date until",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "post": {
          "tags": [
            "HomeLocation - Admin only"
          ],
          "summary": "Create a HomeLocation",
          "description": "The 'homeLocationPK', 'homeLocationId', 'dateTo', and 'dateFrom' will all be generated automatically.",
          "parameters": [
            {
              "name": "home location",
              "description": "home location object",
              "in": "body",
              "required": true,
              "schema": {
                "$ref": "#/definitions/HomeLocation"
              }
            }
          ],
          "responses": {
            "201": {
              "description": "Created"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        }
      },
      "/homelocations/me": {
        "get": {
          "tags": [
            "HomeLocation"
          ],
          "summary": "Get the current user's HomeLocation",
          "description": "This only returns the HomeLocation that is active in the current time scope.",
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "put": {
          "tags": [
            "HomeLocation"
          ],
          "summary": "Update current user's HomeLocation",
          "description": "It is only possible to update:\n 1. 'postcode',\n 2. 'blockRadius',\n 3. 'country' and,\n 4. 'employeeId'",
          "parameters": [
            {
              "name": "home location fields",
              "description": "home location fields for update",
              "in": "body",
              "required": true,
              "schema": {
                "type": "object",
                "properties": {
                  "postcode": {
                    "type": "string"
                  },
                  "blockRadius": {
                    "type": "integer"
                  },
                  "country": {
                    "type": "string"
                  },
                  "employeeId": {
                    "type": "integer reference Employees (employeeId)"
                  }
                },
                "example": {
                  "postcode": "SW6AFL"
                }
              }
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        }
      },
      "/homelocations/bulk": {
        "post": {
          "tags": [
            "HomeLocation - Admin only"
          ],
          "summary": "Create multiple HomeLocations",
          "description": "The 'homeLocationPK', 'homeLocationId', 'dateTo', and 'dateFrom' will all be generated automatically.",
          "parameters": [
            {
              "name": "home locations",
              "description": "array of home location objects",
              "in": "body",
              "required": true,
              "schema": {
                "type": "array",
                "items": {
                  "$ref": "#/definitions/HomeLocation"
                }
              }
            }
          ],
          "responses": {
            "201": {
              "description": "Created"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        }
      },
      "/homelocations/{id}": {
        "get": {
          "tags": [
            "HomeLocation - Admin only"
          ],
          "summary": "Get a HomeLocation",
          "parameters": [
            {
              "name": "id",
              "description": "home location's id",
              "in": "path",
              "required": true,
              "type": "integer"
            },
            {
              "name": "auditDateFrom",
              "description": "date from",
              "in": "query",
              "type": "string"
            },
            {
              "name": "auditDateTo",
              "description": "date until",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "put": {
          "tags": [
            "HomeLocation - Admin only"
          ],
          "summary": "Update a HomeLocation",
          "description": "It is only possible to update:\n 1. 'postcode',\n 2. 'blockRadius',\n 3. 'country' and,\n 4. 'employeeId'",
          "parameters": [
            {
              "name": "id",
              "description": "home location's id",
              "in": "path",
              "required": true,
              "type": "integer"
            },
            {
              "name": "home location fields",
              "description": "home location fields for update",
              "in": "body",
              "required": true,
              "schema": {
                "type": "object",
                "properties": {
                  "postcode": {
                    "type": "string"
                  },
                  "blockRadius": {
                    "type": "integer"
                  },
                  "country": {
                    "type": "string"
                  },
                  "employeeId": {
                    "type": "integer reference Employees (employeeId)"
                  }
                },
                "example": {
                  "postcode": "SW6AFL"
                }
              }
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "delete": {
          "tags": [
            "HomeLocation - Admin only"
          ],
          "summary": "Delete a HomeLocation",
          "parameters": [
            {
              "name": "id",
              "description": "home location's id",
              "in": "path",
              "required": true,
              "type": "integer"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            }
          }
        }
      },
      "/leaveperiods": {
        "get": {
          "tags": [
            "LeavePeriod - Admin only"
          ],
          "summary": "Get all LeavePeriods",
          "parameters": [
            {
              "name": "auditDateFrom",
              "description": "date from",
              "in": "query",
              "type": "string"
            },
            {
              "name": "auditDateTo",
              "description": "date until",
              "in": "query",
              "type": "string"
            },
            {
              "name": "approval",
              "description": "true or false to get either the approved or yet to be approved cases",
              "in": "query",
              "type": "string"
            },
            {
              "name": "employeeId",
              "description": "id of the employee associated with leave period",
              "in": "query",
              "type": "integer reference Employees (employeeId)"
            },
            {
              "name": "dateRangeStart",
              "description": "start date of search range",
              "in": "query",
              "type": "date"
            },
            {
              "name": "dateRangeEnd",
              "description": "end date of search range",
              "in": "query",
              "type": "date"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "post": {
          "tags": [
            "LeavePeriod - Admin only"
          ],
          "summary": "Create a LeavePeriod",
          "description": "The 'leave periodPK', 'leave periodId', 'dateTo', and 'dateFrom' will all be generated automatically.",
          "parameters": [
            {
              "name": "leave period",
              "description": "leave period object",
              "in": "body",
              "required": true,
              "schema": {
                "$ref": "#/definitions/LeavePeriod"
              }
            }
          ],
          "responses": {
            "201": {
              "description": "Created"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        }
      },
      "/leaveperiods/me": {
        "get": {
          "tags": [
            "LeavePeriod"
          ],
          "summary": "Get current user's LeavePeriods",
          "description": "This only returns the LeavePeriods that are active in the current time scope.",
          "parameters": [
            {
              "name": "approval",
              "description": "true or false to get either the approved or yet to be approved cases",
              "in": "query",
              "type": "string"
            },
            {
              "name": "employeeId",
              "description": "id of the employee associated with leave period",
              "in": "query",
              "type": "integer reference Employees (employeeId)"
            },
            {
              "name": "dateRangeStart",
              "description": "start date of search range",
              "in": "query",
              "type": "date"
            },
            {
              "name": "dateRangeEnd",
              "description": "end date of search range",
              "in": "query",
              "type": "date"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "post": {
          "tags": [
            "LeavePeriod"
          ],
          "summary": "Create a LeavePeriod assigned to the current user",
          "description": "The 'employeeId', 'leave periodPK', 'leave periodId', 'dateTo', and 'dateFrom' will all be generated automatically.",
          "parameters": [
            {
              "name": "leave period",
              "description": "leave period object",
              "in": "body",
              "required": true,
              "schema": {
                "type": "object",
                "required": [
                  "startDate",
                  "endDate",
                  "approval"
                ],
                "properties": {
                  "startDate": {
                    "type": "date",
                    "example": "2020-12-20T00:00:00.000Z"
                  },
                  "endDate": {
                    "type": "date",
                    "example": "2020-12-31T00:00:00.000Z"
                  },
                  "approval": {
                    "type": "boolean",
                    "example": true
                  }
                }
              }
            }
          ],
          "responses": {
            "201": {
              "description": "Created"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        }
      },
      "/leaveperiods/bulk": {
        "post": {
          "tags": [
            "LeavePeriod - Admin only"
          ],
          "summary": "Create multiple LeavePeriods",
          "description": "The 'leave periodPK', 'leave periodId', 'dateTo', and 'dateFrom' will all be generated automatically.",
          "parameters": [
            {
              "name": "leave periods",
              "description": "array of leave period objects",
              "in": "body",
              "required": true,
              "schema": {
                "type": "array",
                "items": {
                  "$ref": "#/definitions/BaseLocation"
                }
              }
            }
          ],
          "responses": {
            "201": {
              "description": "Created"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        }
      },
      "/leaveperiods/{id}": {
        "get": {
          "tags": [
            "LeavePeriod - Admin only"
          ],
          "summary": "Get a LeavePeriod",
          "parameters": [
            {
              "name": "id",
              "description": "leave period's id",
              "in": "path",
              "required": true,
              "type": "integer"
            },
            {
              "name": "auditDateFrom",
              "description": "date from",
              "in": "query",
              "type": "string"
            },
            {
              "name": "auditDateTo",
              "description": "date until",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "put": {
          "tags": [
            "LeavePeriod - Admin only"
          ],
          "summary": "Update a LeavePeriod",
          "description": "It is only possible to update:\n 1. 'startDate',\n 2. 'endDate',\n 3. 'approval' and,\n 4. 'employeeId'",
          "parameters": [
            {
              "name": "id",
              "description": "leave period's id",
              "in": "path",
              "required": true,
              "type": "integer"
            },
            {
              "name": "leave period fields",
              "description": "leave period fields for update",
              "in": "body",
              "required": true,
              "schema": {
                "type": "object",
                "properties": {
                  "startDate": {
                    "type": "date"
                  },
                  "endDate": {
                    "type": "date"
                  },
                  "approval": {
                    "type": "boolean"
                  },
                  "employeeId": {
                    "type": "integer reference Employees (employeeId)"
                  }
                },
                "example": {
                  "startDate": "2020-12-19T00:00:00.000Z"
                }
              }
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "delete": {
          "tags": [
            "LeavePeriod - Admin only"
          ],
          "summary": "Delete a LeavePeriod",
          "parameters": [
            {
              "name": "id",
              "description": "leave period's id",
              "in": "path",
              "required": true,
              "type": "integer"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            }
          }
        }
      },
      "/officelocations": {
        "get": {
          "tags": [
            "OfficeLocation - Admin only"
          ],
          "summary": "Get all OfficeLocations",
          "parameters": [
            {
              "name": "auditDateFrom",
              "description": "date from",
              "in": "query",
              "type": "string"
            },
            {
              "name": "auditDateTo",
              "description": "date until",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "post": {
          "tags": [
            "OfficeLocation - Admin only"
          ],
          "summary": "Create an OfficeLocation",
          "description": "The 'officeLocationPK', 'officeLocationId', 'dateTo', and 'dateFrom' will all be generated automatically.",
          "parameters": [
            {
              "name": "office location",
              "description": "office location object",
              "in": "body",
              "required": true,
              "schema": {
                "$ref": "#/definitions/OfficeLocation"
              }
            }
          ],
          "responses": {
            "201": {
              "description": "Created"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        }
      },
      "/officelocations/bulk": {
        "post": {
          "tags": [
            "OfficeLocation - Admin only"
          ],
          "summary": "Create multiple OfficeLocations",
          "description": "The 'officeLocationPK', 'officeLocationId', 'dateTo', and 'dateFrom' will all be generated automatically.",
          "parameters": [
            {
              "name": "office locations",
              "description": "array of office location objects",
              "in": "body",
              "required": true,
              "schema": {
                "type": "array",
                "items": {
                  "$ref": "#/definitions/OfficeLocation"
                }
              }
            }
          ],
          "responses": {
            "201": {
              "description": "Created"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        }
      },
      "/officelocations/{id}": {
        "get": {
          "tags": [
            "OfficeLocation - Admin only"
          ],
          "summary": "Get an OfficeLocation",
          "parameters": [
            {
              "name": "id",
              "description": "office location's id",
              "in": "path",
              "required": true,
              "type": "integer"
            },
            {
              "name": "auditDateFrom",
              "description": "date from",
              "in": "query",
              "type": "string"
            },
            {
              "name": "auditDateTo",
              "description": "date until",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "put": {
          "tags": [
            "OfficeLocation - Admin only"
          ],
          "summary": "Update an OfficeLocation",
          "description": "It is only possible to update:\n 1. 'city',\n 2. 'postcode',\n 3. 'longitude',\n 4. 'latitude' and,\n 5. 'country'",
          "parameters": [
            {
              "name": "id",
              "description": "office location's id",
              "in": "path",
              "required": true,
              "type": "integer"
            },
            {
              "name": "office location fields",
              "description": "office location fields for update",
              "in": "body",
              "required": true,
              "schema": {
                "type": "object",
                "properties": {
                  "city": {
                    "type": "string"
                  },
                  "postcode": {
                    "type": "string"
                  },
                  "longitude": {
                    "type": "string"
                  },
                  "latitude": {
                    "type": "string"
                  },
                  "country": {
                    "type": "string"
                  }
                },
                "example": {
                  "postcode": "SW6AFL"
                }
              }
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "delete": {
          "tags": [
            "OfficeLocation - Admin only"
          ],
          "summary": "Delete an OfficeLocation",
          "parameters": [
            {
              "name": "id",
              "description": "office location's id",
              "in": "path",
              "required": true,
              "type": "integer"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            }
          }
        }
      },
      "/profiles": {
        "post": {
          "tags": [
            "Profile - Admin only"
          ],
          "summary": "Create a Profile",
          "description": "It is required to add the Employee information, the BaseLocation information, BenefitCoverage information, HomeLocation information and StayAway information. All data is required apart from the 'employeePK', 'employeeId', 'baseLocationPK', 'baseLocationId', 'benefitCoveragePK', 'benefitCoverageId', 'homeLocationPK', 'homeLocationId', 'stayAwayPK', 'stayAwayId', 'dateTo', and 'dateFrom' will all be generated automatically.",
          "parameters": [
            {
              "name": "employee profile fields",
              "description": "employee fields",
              "in": "body",
              "required": true,
              "schema": {
                "type": "object",
                "properties": {
                  "firstName": {
                    "type": "string"
                  },
                  "lastName": {
                    "type": "string"
                  },
                  "email": {
                    "type": "string",
                    "example": "example@email.com"
                  },
                  "role": {
                    "type": "string",
                    "example": "Manager"
                  },
                  "isManager": {
                    "type": "boolean"
                  },
                  "isAdmin": {
                    "type": "boolean"
                  },
                  "workDays": {
                    "type": "integer"
                  },
                  "workHours": {
                    "type": "integer",
                    "example": 5
                  },
                  "transport": {
                    "type": "string"
                  },
                  "teamId": {
                    "type": "integer reference Teams (teamId)",
                    "example": 1
                  },
                  "officeLocationId": {
                    "type": "integer reference OfficeLocations (officeLocationId)",
                    "example": 1
                  },
                  "BaseLocation": {
                    "properties": {
                      "currentBaseLocation": {
                        "type": "string",
                        "example": "Home"
                      },
                      "previousBaseLocation": {
                        "type": "string",
                        "example": "Office"
                      }
                    }
                  },
                  "BenefitCoverage": {
                    "properties": {
                      "ca": {
                        "type": "boolean"
                      },
                      "esa": {
                        "type": "boolean"
                      },
                      "hb": {
                        "type": "boolean"
                      },
                      "hppa": {
                        "type": "boolean"
                      },
                      "hpwa": {
                        "type": "boolean"
                      },
                      "hspa": {
                        "type": "boolean"
                      },
                      "hswa": {
                        "type": "boolean"
                      },
                      "jsa": {
                        "type": "boolean"
                      },
                      "pc": {
                        "type": "boolean"
                      },
                      "pip": {
                        "type": "boolean"
                      },
                      "spc": {
                        "type": "boolean"
                      },
                      "uc": {
                        "type": "boolean"
                      }
                    }
                  },
                  "HomeLocation": {
                    "properties": {
                      "postcode": {
                        "type": "string"
                      },
                      "blockRadius": {
                        "type": "integer"
                      },
                      "country": {
                        "type": "string",
                        "example": "England"
                      }
                    }
                  },
                  "StayAway": {
                    "properties": {
                      "daysAway": {
                        "type": "integer"
                      }
                    }
                  }
                }
              }
            }
          ],
          "responses": {
            "201": {
              "description": "Created"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        }
      },
      "/profiles/me": {
        "put": {
          "tags": [
            "Profile"
          ],
          "summary": "Update current user's Profile",
          "description": "It is possible to update the:\n 1. Employee information:\n a. 'workDays',\n b. 'workHours' and,\n c. 'transport\n 2. BaseLocation information:\n a. 'currentBaseLocation'\n b. 'previousBaseLocation'\n c. 'baseLocationNode'\n 3. BenefitCoverage information:\n a. 'ca',\n b. 'esa,\n c. 'hb',\n d. 'hppa',\n e. 'hpwa',\n f. 'hspa',\n g. 'hswa',\n h. 'jsa',\n i. 'pc',\n j. 'pip',\n k. 'spc',\n l. 'uc',\n 4. HomeLocation information:\n a. 'postcode',\n b. 'blockRadius'\n c. 'country'\n 5. StayAway information:\n a. 'daysAway'\n The 'employeePK', 'employeeId', 'baseLocationPK', 'baseLocationId', 'benefitCoveragePK', 'benefitCoverageId', 'homeLocationPK', 'homeLocationId', 'stayAwayPK', 'stayAwayId', 'dateTo', and 'dateFrom' will all be generated automatically.",
          "parameters": [
            {
              "name": "employee profile fields",
              "description": "employee fields",
              "in": "body",
              "required": true,
              "schema": {
                "type": "object",
                "properties": {
                  "workDays": {
                    "type": "integer"
                  },
                  "workHours": {
                    "type": "integer",
                    "example": 5
                  },
                  "transport": {
                    "type": "string"
                  },
                  "BaseLocation": {
                    "properties": {
                      "currentBaseLocation": {
                        "type": "string",
                        "example": "Home"
                      }
                    }
                  },
                  "BenefitCoverage": {
                    "properties": {
                      "ca": {
                        "type": "boolean"
                      },
                      "esa": {
                        "type": "boolean"
                      },
                      "hb": {
                        "type": "boolean"
                      },
                      "hppa": {
                        "type": "boolean"
                      },
                      "hpwa": {
                        "type": "boolean"
                      },
                      "hspa": {
                        "type": "boolean"
                      },
                      "hswa": {
                        "type": "boolean"
                      },
                      "jsa": {
                        "type": "boolean"
                      },
                      "pc": {
                        "type": "boolean"
                      },
                      "pip": {
                        "type": "boolean"
                      },
                      "spc": {
                        "type": "boolean"
                      },
                      "uc": {
                        "type": "boolean"
                      }
                    }
                  },
                  "HomeLocation": {
                    "properties": {
                      "postcode": {
                        "type": "string"
                      },
                      "blockRadius": {
                        "type": "integer"
                      }
                    }
                  },
                  "StayAway": {
                    "properties": {
                      "daysAway": {
                        "type": "integer"
                      }
                    }
                  }
                }
              }
            }
          ],
          "responses": {
            "201": {
              "description": "Created"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "get": {
          "tags": [
            "Profile"
          ],
          "summary": "Get the current user's Profile",
          "description": "Use to get all employee information from the database in relation to the current employee.",
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        }
      },
      "/profiles/{id}": {
        "put": {
          "tags": [
            "Profile - Admin only"
          ],
          "summary": "Update a Profile",
          "description": "It is possible to update the:\n 1. Employee information:\n a. 'firstName',\n b. 'lastName',\n c. 'email',\n d. 'role',\n e. 'isManager',\n f. 'isAdmin',\n g. 'workDays',\n h. 'workHours' and,\n i. 'transport\n 2. BaseLocation information:\n a. 'currentBaseLocation'\n b. 'previousBaseLocation'\n c. 'baseLocationNode'\n 3. BenefitCoverage information:\n a. 'ca',\n b. 'esa,\n c. 'hb',\n d. 'hppa',\n e. 'hpwa',\n f. 'hspa',\n g. 'hswa',\n h. 'jsa',\n i. 'pc',\n j. 'pip',\n k. 'spc',\n l. 'uc',\n 4. HomeLocation information:\n a. 'postcode',\n b. 'blockRadius',\n c. 'country'\n 5. StayAway information:\n a. 'daysAway'\n The 'employeePK', 'employeeId', 'baseLocationPK', 'baseLocationId', 'benefitCoveragePK', 'benefitCoverageId', 'homeLocationPK', 'homeLocationId', 'stayAwayPK', 'stayAwayId', 'dateTo', and 'dateFrom' will all be generated automatically.",
          "parameters": [
            {
              "name": "id",
              "description": "employee's id",
              "in": "path",
              "required": true,
              "type": "integer"
            },
            {
              "name": "employee profile fields",
              "description": "employee fields",
              "in": "body",
              "required": true,
              "schema": {
                "type": "object",
                "properties": {
                  "firstName": {
                    "type": "string"
                  },
                  "lastName": {
                    "type": "string"
                  },
                  "email": {
                    "type": "string",
                    "example": "example@email.com"
                  },
                  "role": {
                    "type": "string",
                    "example": "Manager"
                  },
                  "isManager": {
                    "type": "boolean"
                  },
                  "isAdmin": {
                    "type": "boolean"
                  },
                  "workDays": {
                    "type": "integer"
                  },
                  "workHours": {
                    "type": "integer",
                    "example": 5
                  },
                  "transport": {
                    "type": "string"
                  },
                  "teamId": {
                    "type": "integer reference Teams (teamId)",
                    "example": 1
                  },
                  "officeLocationId": {
                    "type": "integer reference OfficeLocations (officeLocationId)",
                    "example": 1
                  },
                  "BaseLocation": {
                    "properties": {
                      "currentBaseLocation": {
                        "type": "string",
                        "example": "Home"
                      },
                      "previousBaseLocation": {
                        "type": "string",
                        "example": "Office"
                      }
                    }
                  },
                  "BenefitCoverage": {
                    "properties": {
                      "ca": {
                        "type": "boolean"
                      },
                      "esa": {
                        "type": "boolean"
                      },
                      "hb": {
                        "type": "boolean"
                      },
                      "hppa": {
                        "type": "boolean"
                      },
                      "hpwa": {
                        "type": "boolean"
                      },
                      "hspa": {
                        "type": "boolean"
                      },
                      "hswa": {
                        "type": "boolean"
                      },
                      "jsa": {
                        "type": "boolean"
                      },
                      "pc": {
                        "type": "boolean"
                      },
                      "pip": {
                        "type": "boolean"
                      },
                      "spc": {
                        "type": "boolean"
                      },
                      "uc": {
                        "type": "boolean"
                      }
                    }
                  },
                  "HomeLocation": {
                    "properties": {
                      "postcode": {
                        "type": "string"
                      },
                      "blockRadius": {
                        "type": "integer"
                      },
                      "country": {
                        "type": "string",
                        "example": "England"
                      }
                    }
                  },
                  "StayAway": {
                    "properties": {
                      "daysAway": {
                        "type": "integer"
                      }
                    }
                  }
                }
              }
            }
          ],
          "responses": {
            "201": {
              "description": "Created"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "get": {
          "tags": [
            "Profile - Admin only"
          ],
          "summary": "Get a Profile",
          "description": "This only returns the Profile that is active in the current time scope.",
          "parameters": [
            {
              "name": "id",
              "description": "employee's id",
              "in": "path",
              "required": true,
              "type": "integer"
            },
            {
              "name": "auditDateFrom",
              "description": "date from",
              "in": "query",
              "type": "string"
            },
            {
              "name": "auditDateTo",
              "description": "date until",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "delete": {
          "tags": [
            "Profile - Admin only"
          ],
          "summary": "Delete a Profile",
          "parameters": [
            {
              "name": "id",
              "description": "employee's id",
              "in": "path",
              "required": true,
              "type": "integer"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            }
          }
        }
      },
      "/schedules": {
        "get": {
          "tags": [
            "Schedule - Admin only"
          ],
          "summary": "Get all Schedules",
          "parameters": [
            {
              "name": "auditDateFrom",
              "description": "date from",
              "in": "query",
              "type": "string"
            },
            {
              "name": "auditDateTo",
              "description": "date until",
              "in": "query",
              "type": "string"
            },
            {
              "name": "managerApproval",
              "description": "true or false to either get the manager approved or non manager approved schedules",
              "in": "query",
              "type": "boolean"
            },
            {
              "name": "day",
              "description": "number of the day of the visiting period",
              "in": "query",
              "type": "integer"
            },
            {
              "name": "visitingPeriodId",
              "description": "id of the visiting period associated with the schedules",
              "in": "query",
              "type": "integer reference VisitingPeriods (visitingPeriodId)"
            },
            {
              "name": "teamId",
              "description": "id of the team associated with the schedules",
              "in": "query",
              "type": "integer reference Teams (teamId)"
            },
            {
              "name": "employeeId",
              "description": "id of the employee associated with the schedules",
              "in": "query",
              "type": "integer reference Employees (employeeId)"
            },
            {
              "name": "dateRangeStart",
              "description": "start date of search range. Use key phrase 'not-null' to get only schedules with a setDate value set",
              "in": "query",
              "type": "string"
            },
            {
              "name": "dateRangeEnd",
              "description": "end date of search range",
              "in": "query",
              "type": "date"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "post": {
          "tags": [
            "Schedule - Admin only"
          ],
          "summary": "Create a Schedule",
          "description": "The 'schedulePK', 'scheduleId', 'dateTo', and 'dateFrom' will all be generated automatically.",
          "parameters": [
            {
              "name": "schedule",
              "description": "schedule object",
              "in": "body",
              "required": true,
              "schema": {
                "$ref": "#/definitions/Schedule"
              }
            }
          ],
          "responses": {
            "201": {
              "description": "Created"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "put": {
          "tags": [
            "Schedule"
          ],
          "summary": "update multiple Schedules",
          "description": "The body must include the 'scheduleId' and 'caseId' to specify which schedule and the aligned case are being updated. It is only possible to update:\n 1. 'ScheduleId',\n 2. 'caseId',\n 3. 'day',\n 4. 'order',\n 5. 'travelTime',\n 6. 'travelDistance',\n 7. 'managerApproval',\n 8. 'stayAway',\n 9. 'setDate',\n 10. 'employeeId',\n 11. 'visitingPeriodId' and,\n 12. 'teamId'",
          "parameters": [
            {
              "name": "schedules",
              "description": "array of schedule objects",
              "in": "body",
              "required": true,
              "schema": {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": [
                    "scheduleId",
                    "caseId"
                  ],
                  "properties": {
                    "scheduleId": {
                      "type": "integer reference Schedule (scheduleId)"
                    },
                    "day": {
                      "type": "integer"
                    },
                    "order": {
                      "type": "integer"
                    },
                    "travelTime": {
                      "type": "integer"
                    },
                    "travelDistance": {
                      "type": "integer"
                    },
                    "managerApproval": {
                      "type": "boolean"
                    },
                    "stayAway": {
                      "type": "boolean"
                    },
                    "setDate": {
                      "type": "date"
                    },
                    "employeeId": {
                      "type": "integer reference Employees (employeeId)"
                    },
                    "caseId": {
                      "type": "integer reference Cases (caseId)"
                    },
                    "visitingPeriodId": {
                      "type": "integer reference VisitingPeriods (visitingPeriodId)"
                    },
                    "teamId": {
                      "type": "integer reference Teams (teamId)"
                    }
                  }
                },
                "example": [
                  {
                    "scheduleId": 1,
                    "employeeId": 3,
                    "caseId": 2
                  },
                  {
                    "scheduleId": 2,
                    "employeeId": 3,
                    "caseId": 3
                  }
                ]
              }
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        }
      },
      "/schedules/me": {
        "get": {
          "tags": [
            "Schedule"
          ],
          "summary": "Get Schedules associated with the current user",
          "description": "This only returns the Schedules that are active in the current time scope.",
          "parameters": [
            {
              "name": "managerApproval",
              "description": "true or false to either get the manager approved or non manager approved schedules",
              "in": "query",
              "type": "boolean"
            },
            {
              "name": "day",
              "description": "number of the day of the visiting period",
              "in": "query",
              "type": "integer"
            },
            {
              "name": "visitingPeriodId",
              "description": "id of the visiting period associated with the schedules",
              "in": "query",
              "type": "integer reference VisitingPeriods (visitingPeriodId)"
            },
            {
              "name": "dateRangeStart",
              "description": "start date of search range. Use key phrase 'not-null' to get only schedules with a setDate value set",
              "in": "query",
              "type": "string"
            },
            {
              "name": "dateRangeEnd",
              "description": "end date of search range",
              "in": "query",
              "type": "date"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        }
      },
      "/schedules/bulk": {
        "post": {
          "tags": [
            "Schedule - Admin only"
          ],
          "summary": "Create multiple Schedules",
          "description": "The 'schedulePK', 'scheduleId', 'dateTo', and 'dateFrom' will all be generated automatically.",
          "parameters": [
            {
              "name": "schedules",
              "description": "array of schedule objects",
              "in": "body",
              "required": true,
              "schema": {
                "type": "array",
                "items": {
                  "$ref": "#/definitions/Schedule"
                }
              }
            }
          ],
          "responses": {
            "201": {
              "description": "Created"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        }
      },
      "/schedules/{id}": {
        "get": {
          "tags": [
            "Schedule - Admin only"
          ],
          "summary": "Get a Schedule",
          "parameters": [
            {
              "name": "id",
              "description": "schedule's id",
              "in": "path",
              "required": true,
              "type": "integer"
            },
            {
              "name": "auditDateFrom",
              "description": "date from",
              "in": "query",
              "type": "string"
            },
            {
              "name": "auditDateTo",
              "description": "date until",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "put": {
          "tags": [
            "Schedule"
          ],
          "summary": "Update a Schedule",
          "description": "It is only possible to update:\n 1. 'day',\n 2. 'order',\n 3. 'travelTime',\n 4. 'travelDistance',\n 5. 'managerApproval',\n 6. 'stayAway',\n 7. 'setDate',\n 8. 'employeeId',\n 9. 'caseId',\n 10. 'visitingPeriodId' and,\n 11. 'teamId'",
          "parameters": [
            {
              "name": "id",
              "description": "schedule's id",
              "in": "path",
              "required": true,
              "type": "integer"
            },
            {
              "name": "schedule fields",
              "description": "schedule fields for update",
              "in": "body",
              "required": true,
              "schema": {
                "type": "object",
                "properties": {
                  "day": {
                    "type": "integer"
                  },
                  "order": {
                    "type": "integer"
                  },
                  "travelTime": {
                    "type": "integer"
                  },
                  "travelDistance": {
                    "type": "integer"
                  },
                  "managerApproval": {
                    "type": "boolean"
                  },
                  "stayAway": {
                    "type": "boolean"
                  },
                  "setDate": {
                    "type": "date"
                  },
                  "employeeId": {
                    "type": "integer reference Employees (employeeId)"
                  },
                  "caseId": {
                    "type": "integer reference Cases (caseId)"
                  },
                  "visitingPeriodId": {
                    "type": "integer reference VisitingPeriod (visitingPeriodId)"
                  },
                  "teamId": {
                    "type": "integer reference Teams (teamId)"
                  }
                },
                "example": {
                  "employeeId": 2
                }
              }
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "delete": {
          "tags": [
            "Schedule - Admin only"
          ],
          "summary": "Delete a Schedule",
          "parameters": [
            {
              "name": "id",
              "description": "schedule's id",
              "in": "path",
              "required": true,
              "type": "integer"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            }
          }
        }
      },
      "/stayaways": {
        "get": {
          "tags": [
            "StayAway - Admin only"
          ],
          "summary": "Get all StayAways",
          "parameters": [
            {
              "name": "auditDateFrom",
              "description": "date from",
              "in": "query",
              "type": "string"
            },
            {
              "name": "auditDateTo",
              "description": "date until",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "post": {
          "tags": [
            "StayAway - Admin only"
          ],
          "summary": "Create a StayAway",
          "description": "The 'stayAwayPK', 'stayAwayId', 'dateTo', and 'dateFrom' will all be generated automatically.",
          "parameters": [
            {
              "name": "stay away",
              "description": "stay away object",
              "in": "body",
              "required": true,
              "schema": {
                "$ref": "#/definitions/StayAway"
              }
            }
          ],
          "responses": {
            "201": {
              "description": "Created"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        }
      },
      "/stayaways/me": {
        "get": {
          "tags": [
            "StayAway"
          ],
          "summary": "Get the current user's StayAway",
          "description": "This only returns the StayAway that is active in the current time scope.",
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "put": {
          "tags": [
            "StayAway"
          ],
          "summary": "Update current user's StayAway",
          "description": "It is only possible to update:\n 1. 'daysAway' and,\n 2. 'employeeId'",
          "parameters": [
            {
              "name": "stay away fields",
              "description": "stay away fields for update",
              "in": "body",
              "required": true,
              "schema": {
                "type": "object",
                "properties": {
                  "daysAway": {
                    "type": "string"
                  },
                  "employeeId": {
                    "type": "integer reference Employees (employeeId)"
                  }
                },
                "example": {
                  "daysAway": 5
                }
              }
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        }
      },
      "/stayaways/bulk": {
        "post": {
          "tags": [
            "StayAway - Admin only"
          ],
          "summary": "Create multiple StayAways",
          "description": "The 'stayAwayPK', 'stayAwayId', 'dateTo', and 'dateFrom' will all be generated automatically.",
          "parameters": [
            {
              "name": "stay aways",
              "description": "array of stay away objects",
              "in": "body",
              "required": true,
              "schema": {
                "type": "array",
                "items": {
                  "$ref": "#/definitions/StayAway"
                }
              }
            }
          ],
          "responses": {
            "201": {
              "description": "Created"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        }
      },
      "/stayaways/{id}": {
        "get": {
          "tags": [
            "StayAway - Admin only"
          ],
          "summary": "Get a StayAway",
          "parameters": [
            {
              "name": "id",
              "description": "stay away's id",
              "in": "path",
              "required": true,
              "type": "integer"
            },
            {
              "name": "auditDateFrom",
              "description": "date from",
              "in": "query",
              "type": "string"
            },
            {
              "name": "auditDateTo",
              "description": "date until",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "put": {
          "tags": [
            "StayAway - Admin only"
          ],
          "summary": "Update a StayAway",
          "description": "It is only possible to update:\n 1. 'daysAway' and,\n 2. 'employeeId'",
          "parameters": [
            {
              "name": "id",
              "description": "stay away's id",
              "in": "path",
              "required": true,
              "type": "integer"
            },
            {
              "name": "stay away fields",
              "description": "stay away fields for update",
              "in": "body",
              "required": true,
              "schema": {
                "type": "object",
                "properties": {
                  "daysAway": {
                    "type": "string"
                  },
                  "employeeId": {
                    "type": "integer reference Employees (employeeId)"
                  }
                },
                "example": {
                  "daysAway": 5
                }
              }
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "delete": {
          "tags": [
            "StayAway - Admin only"
          ],
          "summary": "Delete a StayAway",
          "parameters": [
            {
              "name": "id",
              "description": "stay away's id",
              "in": "path",
              "required": true,
              "type": "integer"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            }
          }
        }
      },
      "/teams": {
        "get": {
          "tags": [
            "Team"
          ],
          "summary": "Get all Teams",
          "parameters": [
            {
              "name": "auditDateFrom",
              "description": "date from",
              "in": "query",
              "type": "string"
            },
            {
              "name": "auditDateTo",
              "description": "date until",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "post": {
          "tags": [
            "Team - Admin only"
          ],
          "summary": "Create a Team",
          "description": "The 'teamPK', 'teamId', 'dateTo', and 'dateFrom' will all be generated automatically.",
          "parameters": [
            {
              "name": "team",
              "description": "team object",
              "in": "body",
              "required": true,
              "schema": {
                "$ref": "#/definitions/Team"
              }
            }
          ],
          "responses": {
            "201": {
              "description": "Created"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        }
      },
      "/teams/bulk": {
        "post": {
          "tags": [
            "Team - Admin only"
          ],
          "summary": "Create multiple Teams",
          "description": "The 'visitingPeriodPK', 'visitingPeriodId', 'dateTo', and 'dateFrom' will all be generated automatically.",
          "parameters": [
            {
              "name": "teams",
              "description": "array of team objects",
              "in": "body",
              "required": true,
              "schema": {
                "type": "array",
                "items": {
                  "$ref": "#/definitions/Team"
                }
              }
            }
          ],
          "responses": {
            "201": {
              "description": "Created"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        }
      },
      "/teams/{id}": {
        "get": {
          "tags": [
            "Team"
          ],
          "summary": "Get a Team",
          "parameters": [
            {
              "name": "id",
              "description": "team's id",
              "in": "path",
              "required": true,
              "type": "integer"
            },
            {
              "name": "auditDateFrom",
              "description": "date from",
              "in": "query",
              "type": "string"
            },
            {
              "name": "auditDateTo",
              "description": "date until",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "put": {
          "tags": [
            "Team - Admin only"
          ],
          "summary": "Update a Team",
          "description": "It is only possible to update:\n 1. 'teamName'",
          "parameters": [
            {
              "name": "id",
              "description": "team's id",
              "in": "path",
              "required": true,
              "type": "integer"
            },
            {
              "name": "team fields",
              "description": "team fields for update",
              "in": "body",
              "required": true,
              "schema": {
                "type": "object",
                "properties": {
                  "teamName": {
                    "type": "string"
                  }
                },
                "example": {
                  "teamName": "Team One"
                }
              }
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "delete": {
          "tags": [
            "Team - Admin only"
          ],
          "summary": "Delete a Team",
          "parameters": [
            {
              "name": "id",
              "description": "team's id",
              "in": "path",
              "required": true,
              "type": "integer"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            }
          }
        }
      },
      "/visitingperiods": {
        "get": {
          "tags": [
            "VisitingPeriod"
          ],
          "summary": "Get all VisitingPeriods",
          "parameters": [
            {
              "name": "auditDateFrom",
              "description": "date from",
              "in": "query",
              "type": "string"
            },
            {
              "name": "auditDateTo",
              "description": "date until",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "post": {
          "tags": [
            "VisitingPeriod - Admin only"
          ],
          "summary": "Create a VisitingPeriod",
          "description": "The 'visitingPeriodPK', 'visitingPeriodId', 'dateTo', and 'dateFrom' will all be generated automatically.",
          "parameters": [
            {
              "name": "visiting period",
              "description": "visiting period object",
              "in": "body",
              "required": true,
              "schema": {
                "$ref": "#/definitions/VisitingPeriod"
              }
            }
          ],
          "responses": {
            "201": {
              "description": "Created"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        }
      },
      "/visitingperiods/bulk": {
        "post": {
          "tags": [
            "VisitingPeriod - Admin only"
          ],
          "summary": "Create multiple VisitingPeriods",
          "description": "The 'visitingPeriodPK', 'visitingPeriodId', 'dateTo', and 'dateFrom' will all be generated automatically.",
          "parameters": [
            {
              "name": "visiting periods",
              "description": "array of visiting period objects",
              "in": "body",
              "required": true,
              "schema": {
                "type": "array",
                "items": {
                  "$ref": "#/definitions/VisitingPeriod"
                }
              }
            }
          ],
          "responses": {
            "201": {
              "description": "Created"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        }
      },
      "/visitingperiods/{id}": {
        "get": {
          "tags": [
            "VisitingPeriod"
          ],
          "summary": "Get a VisitingPeriod",
          "parameters": [
            {
              "name": "id",
              "description": "visiting period's id",
              "in": "path",
              "required": true,
              "type": "integer"
            },
            {
              "name": "auditDateFrom",
              "description": "date from",
              "in": "query",
              "type": "string"
            },
            {
              "name": "auditDateTo",
              "description": "date until",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "put": {
          "tags": [
            "VisitingPeriod - Admin only"
          ],
          "summary": "Update a VisitingPeriod",
          "description": "It is only possible to uopdate:\n 1. 'number',\n 2. 'startDate' and,\n 3. 'endDate'",
          "parameters": [
            {
              "name": "id",
              "description": "visiting period's id",
              "in": "path",
              "required": true,
              "type": "integer"
            },
            {
              "name": "visiting period fields",
              "description": "visiting period fields for update",
              "in": "body",
              "required": true,
              "schema": {
                "type": "object",
                "properties": {
                  "number": {
                    "type": "integer"
                  },
                  "startDate": {
                    "type": "date"
                  },
                  "endDate": {
                    "type": "date"
                  }
                },
                "example": {
                  "endDate": "2020-09-30T00:00:00.000Z"
                }
              }
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            },
            "422": {
              "description": "Unprocessable entity"
            }
          }
        },
        "delete": {
          "tags": [
            "VisitingPeriod - Admin only"
          ],
          "summary": "Delete a VisitingPeriod",
          "parameters": [
            {
              "name": "id",
              "description": "visiting period's id",
              "in": "path",
              "required": true,
              "type": "integer"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad request"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found"
            }
          }
        }
      }
    },
    "definitions": {
      "BaseLocation": {
        "type": "object",
        "required": [
          "currentBaseLocation",
          "previousBaseLocation",
          "employeeId"
        ],
        "properties": {
          "baseLocationPK": {
            "type": "integer",
            "readOnly": true,
            "example": 1
          },
          "baseLocationId": {
            "type": "integer",
            "readOnly": true,
            "example": 1
          },
          "currentBaseLocation": {
            "type": "string",
            "example": "Home"
          },
          "previousBaseLocation": {
            "type": "string",
            "example": "Office"
          },
          "baseLocationNode": {
            "type": "integer",
            "example": 1
          },
          "dateFrom": {
            "type": "string",
            "readOnly": true,
            "example": "2019-04-15T00:00:00.000Z"
          },
          "dateTo": {
            "type": "string",
            "readOnly": true,
            "example": "3999-12-31T00:00:00.000Z"
          },
          "employeeId": {
            "type": "integer reference Employees (employeeId)",
            "example": 1
          }
        }
      },
      "BenefitCoverage": {
        "type": "object",
        "required": [
          "ca",
          "esa",
          "hb",
          "hppa",
          "hpwa",
          "hspa",
          "hswa",
          "jsa",
          "pc",
          "pip",
          "spc",
          "uc",
          "employeeId"
        ],
        "properties": {
          "benefitCoveragePK": {
            "type": "integer",
            "readOnly": true,
            "example": 1
          },
          "benefitCoverageId": {
            "type": "integer",
            "readOnly": true,
            "example": 1
          },
          "ca": {
            "type": "boolean",
            "example": true
          },
          "esa": {
            "type": "boolean",
            "example": true
          },
          "hb": {
            "type": "boolean",
            "example": true
          },
          "hppa": {
            "type": "boolean",
            "example": true
          },
          "hpwa": {
            "type": "boolean",
            "example": true
          },
          "hspa": {
            "type": "boolean",
            "example": true
          },
          "hswa": {
            "type": "boolean",
            "example": true
          },
          "jsa": {
            "type": "boolean",
            "example": true
          },
          "pc": {
            "type": "boolean",
            "example": true
          },
          "pip": {
            "type": "boolean",
            "example": true
          },
          "spc": {
            "type": "boolean",
            "example": true
          },
          "uc": {
            "type": "boolean",
            "example": true
          },
          "dateFrom": {
            "type": "date",
            "readOnly": true,
            "example": "2019-04-15T00:00:00.000Z"
          },
          "dateTo": {
            "type": "date",
            "readOnly": true,
            "example": "3999-12-31T00:00:00.000Z"
          },
          "employeeId": {
            "type": "integer reference Employees (employeeId)",
            "example": 1
          }
        }
      },
      "Case": {
        "type": "object",
        "required": [
          "caseNumber",
          "benefitType",
          "postcode",
          "localAuthority",
          "isReserve"
        ],
        "properties": {
          "casePK": {
            "type": "integer",
            "readOnly": true,
            "example": 1
          },
          "caseId": {
            "type": "integer",
            "readOnly": true,
            "example": 1
          },
          "caseNumber": {
            "type": "string",
            "example": "ESA65732"
          },
          "benefitType": {
            "type": "string",
            "example": "ESA"
          },
          "postcode": {
            "type": "string",
            "example": "W52EJ"
          },
          "longitude": {
            "type": "string",
            "example": "234.567"
          },
          "latitude": {
            "type": "string",
            "example": "567.234"
          },
          "localAuthority": {
            "type": "string",
            "example": "Ealing"
          },
          "isReserve": {
            "type": "boolean",
            "example": true
          },
          "isAbandoned": {
            "type": "boolean",
            "example": true
          },
          "reservedBy": {
            "type": "integer reference Employees (employeeId)",
            "readOnly": true,
            "example": 1
          },
          "abandonedBy": {
            "type": "integer reference Employees (employeeId)",
            "readOnly": true,
            "example": 1
          },
          "comments": {
            "type": "string",
            "example": "This is a comment"
          },
          "caseNode": {
            "type": "integer",
            "example": 1
          },
          "dateFrom": {
            "type": "string",
            "readOnly": true,
            "example": "2019-04-15T00:00:00.000Z"
          },
          "dateTo": {
            "type": "string",
            "readOnly": true,
            "example": "3999-12-31T00:00:00.000Z"
          }
        }
      },
      "Employee": {
        "type": "object",
        "required": [
          "firstName",
          "lastName",
          "email",
          "role",
          "isManager",
          "isAdmin",
          "workDays",
          "workHours",
          "transport",
          "teamId",
          "officeLocationId"
        ],
        "properties": {
          "employeePK": {
            "type": "integer",
            "readOnly": true,
            "example": 1
          },
          "employeeId": {
            "type": "integer",
            "readOnly": true,
            "example": 1
          },
          "firstName": {
            "type": "string",
            "example": "John"
          },
          "lastName": {
            "type": "string",
            "example": "Doe"
          },
          "email": {
            "type": "string",
            "example": "john.doe@email.com"
          },
          "role": {
            "type": "string",
            "example": "Manager"
          },
          "isManager": {
            "type": "boolean",
            "example": true
          },
          "isAdmin": {
            "type": "boolean",
            "example": true
          },
          "workDays": {
            "type": "integer",
            "example": 5
          },
          "workHours": {
            "type": "integer",
            "example": 8
          },
          "transport": {
            "type": "string",
            "example": "car"
          },
          "dateFrom": {
            "type": "string",
            "readOnly": true,
            "example": "2019-04-15T00:00:00.000Z"
          },
          "dateTo": {
            "type": "string",
            "readOnly": true,
            "example": "3999-12-31T00:00:00.000Z"
          },
          "teamId": {
            "type": "integer reference Teams (teamId)",
            "example": 1
          },
          "officeLocationId": {
            "type": "integer reference OfficeLocations (officeLocationId)",
            "example": 1
          }
        }
      },
      "HomeLocation": {
        "type": "object",
        "required": [
          "postcode",
          "blockRadius",
          "country",
          "employeeId"
        ],
        "properties": {
          "homeLocationPK": {
            "type": "integer",
            "readOnly": true,
            "example": 1
          },
          "homeLocationId": {
            "type": "integer",
            "readOnly": true,
            "example": 1
          },
          "postcode": {
            "type": "string",
            "example": "W53EJ"
          },
          "blockRadius": {
            "type": "integer",
            "example": 4
          },
          "country": {
            "type": "string",
            "example": "England"
          },
          "latitude": {
            "type": "string",
            "example": "111.234"
          },
          "longitude": {
            "type": "string",
            "example": "222.345"
          },
          "dateFrom": {
            "type": "string",
            "readOnly": true,
            "example": "2019-04-15T00:00:00.000Z"
          },
          "dateTo": {
            "type": "string",
            "readOnly": true,
            "example": "3999-12-31T00:00:00.000Z"
          },
          "employeeId": {
            "type": "integer reference Employees (employeeId)",
            "example": 1
          }
        }
      },
      "LeavePeriod": {
        "type": "object",
        "required": [
          "startDate",
          "endDate",
          "approval",
          "employeeId"
        ],
        "properties": {
          "leavePeriodPK": {
            "type": "integer",
            "readOnly": true,
            "example": 1
          },
          "leavePeriodId": {
            "type": "integer",
            "readOnly": true,
            "example": 1
          },
          "startDate": {
            "type": "date",
            "example": "2020-12-20T00:00:00.000Z"
          },
          "endDate": {
            "type": "date",
            "example": "2020-12-31T00:00:00.000Z"
          },
          "approval": {
            "type": "boolean",
            "example": true
          },
          "dateFrom": {
            "type": "string",
            "readOnly": true,
            "example": "2019-04-15T00:00:00.000Z"
          },
          "dateTo": {
            "type": "string",
            "readOnly": true,
            "example": "3999-12-31T00:00:00.000Z"
          },
          "employeeId": {
            "type": "integer reference Employees (employeeId)",
            "example": 1
          }
        }
      },
      "OfficeLocation": {
        "type": "object",
        "required": [
          "city",
          "postcode",
          "country"
        ],
        "properties": {
          "officeLocationPK": {
            "type": "integer",
            "readOnly": true,
            "example": 1
          },
          "officeLocationId": {
            "type": "integer",
            "readOnly": true,
            "example": 1
          },
          "city": {
            "type": "string",
            "example": "London"
          },
          "postcode": {
            "type": "string",
            "example": "W53EJ"
          },
          "country": {
            "type": "string",
            "example": "England"
          },
          "latitude": {
            "type": "string",
            "example": "111.234"
          },
          "longitude": {
            "type": "string",
            "example": "222.345"
          },
          "dateFrom": {
            "type": "string",
            "readOnly": true,
            "example": "2019-04-15T00:00:00.000Z"
          },
          "dateTo": {
            "type": "string",
            "readOnly": true,
            "example": "3999-12-31T00:00:00.000Z"
          }
        }
      },
      "Schedule": {
        "type": "object",
        "required": [
          "day",
          "order",
          "travelTime",
          "travelDistance",
          "managerApproval",
          "stayAway",
          "employeeId",
          "caseId",
          "visitingPeriodId",
          "teamId"
        ],
        "properties": {
          "schedulePK": {
            "type": "integer",
            "readOnly": true,
            "example": 1
          },
          "scheduleId": {
            "type": "integer",
            "readOnly": true,
            "example": 1
          },
          "day": {
            "type": "integer",
            "example": 1
          },
          "order": {
            "type": "integer",
            "example": 1
          },
          "travelTime": {
            "type": "float",
            "example": 60.532
          },
          "travelDistance": {
            "type": "float",
            "example": 33.3333
          },
          "managerApproval": {
            "type": "boolean",
            "example": true
          },
          "stayAway": {
            "type": "boolean",
            "example": false
          },
          "setDate": {
            "type": "date",
            "example": "2020-04-15T00:00:00.000Z"
          },
          "dateFrom": {
            "type": "string",
            "readOnly": true,
            "example": "2019-04-15T00:00:00.000Z"
          },
          "dateTo": {
            "type": "string",
            "readOnly": true,
            "example": "3999-12-31T00:00:00.000Z"
          },
          "employeeId": {
            "type": "integer reference Employees (employeeId)",
            "example": 1
          },
          "caseId": {
            "type": "integer reference Cases (casesId)",
            "example": 1
          },
          "visitingPeriodId": {
            "type": "integer reference VisitingPeriods (visitingPeriodId)",
            "example": 1
          },
          "teamId": {
            "type": "integer reference Teams (teamId)",
            "example": 1
          }
        }
      },
      "StayAway": {
        "type": "object",
        "required": [
          "daysAway",
          "employeeId"
        ],
        "properties": {
          "stayAwayPK": {
            "type": "integer",
            "readOnly": true,
            "example": 1
          },
          "stayAwayId": {
            "type": "integer",
            "readOnly": true,
            "example": 1
          },
          "daysAway": {
            "type": "integer",
            "example": 4
          },
          "dateFrom": {
            "type": "string",
            "readOnly": true,
            "example": "2019-04-15T00:00:00.000Z"
          },
          "dateTo": {
            "type": "string",
            "readOnly": true,
            "example": "3999-12-31T00:00:00.000Z"
          },
          "employeeId": {
            "type": "integer reference Employees (employeeId)",
            "example": 1
          }
        }
      },
      "Team": {
        "type": "object",
        "required": [
          "teamName"
        ],
        "properties": {
          "teamPK": {
            "type": "integer",
            "readOnly": true,
            "example": 1
          },
          "teamId": {
            "type": "integer",
            "readOnly": true,
            "example": 1
          },
          "teamName": {
            "type": "string",
            "example": "Team 1"
          },
          "dateFrom": {
            "type": "string",
            "readOnly": true,
            "example": "2019-04-15T00:00:00.000Z"
          },
          "dateTo": {
            "type": "string",
            "readOnly": true,
            "example": "3999-12-31T00:00:00.000Z"
          }
        }
      },
      "VisitingPeriod": {
        "type": "object",
        "required": [
          "number",
          "startDate",
          "endDate"
        ],
        "properties": {
          "visitingPeriodPK": {
            "type": "integer",
            "readOnly": true,
            "example": 1
          },
          "visitingPeriodId": {
            "type": "integer",
            "readOnly": true,
            "example": 1
          },
          "number": {
            "type": "integer",
            "example": 1
          },
          "startDate": {
            "type": "date",
            "example": "2020-01-01T00:00:00.000Z"
          },
          "endDate": {
            "type": "date",
            "example": "2020-04-30T00:00:00.000Z"
          },
          "dateFrom": {
            "type": "string",
            "readOnly": true,
            "example": "2019-04-15T00:00:00.000Z"
          },
          "dateTo": {
            "type": "string",
            "readOnly": true,
            "example": "3999-12-31T00:00:00.000Z"
          }
        }
      }
    },
    "responses": {},
    "parameters": {},
    "securityDefinitions": {},
    "tags": []
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  var urls = options.swaggerUrls
  var customOptions = options.customOptions
  var spec1 = options.swaggerDoc
  var swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (var attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  var ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.oauth) {
    ui.initOAuth(customOptions.oauth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }

  window.ui = ui
}
