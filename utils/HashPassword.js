import bcrypt from "bcryptjs";

const password = "admin@master"; // Replace with the password you want to hash

const hashedPassword = bcrypt.hashSync(password, 10);

console.log("Hashed Password:", hashedPassword);
