import express from "express";
const router = express.Router();
import { promises as fs } from "fs";

const { readFile, writeFile } = fs;

router.post("/", async (req, res, next) => {
  try {
    let account = req.body;
    if (!account.name || !account.balance) {
      throw new Error("Name and balance are required");
    }
    const data = JSON.parse(await readFile(global.fileName));

    account = {
      id: data.nextId++,
      name: account.name,
      balance: account.balance,
    };
    data.accounts.push(account);
    await writeFile(global.fileName, JSON.stringify(data, null, 2));
    res.send(account);
  } catch (err) {
    next();
  }
});

router.get("/", async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    delete data.nextId;
    res.send(data);
  } catch (err) {
    next();
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    const account = data.accounts.find(
      (account) => account.id === parseInt(req.params.id)
    );
    res.send(account);
  } catch (err) {
    next();
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    const account = data.accounts.find(
      (account) => account.id !== parseInt(req.params.id)
    );
    await writeFile(global.fileName, JSON.stringify(data, null, 2));
    res.end();
  } catch (err) {
    next();
  }
});

router.put("/", async (req, res, next) => {
  try {
    const account = req.body;

    if (!account.name || !account.balance) {
      throw new Error("Name and balance are required");
    }
    
    const data = JSON.parse(await readFile(global.fileName));
    const index = data.accounts.findIndex((a) => a.id === parseInt(account.id));

    if (index <=0) {
      throw new Error("Account not found");
    }

    data.accounts[index] = account;
    await writeFile(global.fileName, JSON.stringify(data, null, 2));
    res.send(data.accounts[index]);
  } catch (err) {
    next();
  }
});

router.patch("/updateBalance", async (req, res, next) => {
  try {
    const account = req.body;

    if (!account.id || !account.balance) {
      throw new Error("Id and balance are required");
    }

    const data = JSON.parse(await readFile(global.fileName));
    const index = data.accounts.findIndex((a) => a.id === parseInt(account.id));

    if (index <=0) {
      throw new Error("Account not found");
    }

    data.accounts[index].balance = account.balance;
    await writeFile(global.fileName, JSON.stringify(data, null, 2));
    res.send(data.accounts[index]);
  } catch (err) {
    next();
  }
});

router.use((err, req, res, next) => {
  loggers.error(`${req.method} ${req.baseUrl} - ${err.message}`);
  res.status(400).send({ error: err.message });
});

export default router;
