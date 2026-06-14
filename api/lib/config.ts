import * as process from "process";

export const config = {
    port: process.env.PORT || 3100,
    database: "",
    dbUser: "",
    dbPassword: "",
    dbHost: "",
    dbPort: 5432,
};
