import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ethers } from "ethers";
import { User } from "../models/User.js";

const router = Router();

/** 1. Normal Auth: Signup */
router.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "email_and_password_required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "user_already_exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name });

    const token = jwt.sign({ sub: user._id, email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (e) {
    return res.status(500).json({ error: "signup_failed" });
  }
});

/** 2. Normal Auth: Login */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "invalid_credentials" });
    }

    const token = jwt.sign({ sub: user._id, email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (e) {
    return res.status(500).json({ error: "login_failed" });
  }
});

/** 3. Web3 SIWE: Request Nonce */
router.post("/web3/nonce", async (req, res) => {
  try {
    const { wallet } = req.body || {};
    if (!wallet) return res.status(400).json({ error: "wallet_required" });

    let user = await User.findOne({ wallet: wallet.toLowerCase() });
    if (!user) {
      user = await User.create({ wallet: wallet.toLowerCase() });
    } else {
      user.nonce = Math.floor(Math.random() * 1000000).toString();
      await user.save();
    }

    return res.json({ nonce: user.nonce });
  } catch (e) {
    return res.status(500).json({ error: "nonce_request_failed" });
  }
});

/** 4. Web3 SIWE: Verify Signature & Login */
router.post("/web3/verify", async (req, res) => {
  try {
    const { wallet, signature } = req.body || {};
    if (!wallet || !signature) return res.status(400).json({ error: "wallet_and_signature_required" });

    const user = await User.findOne({ wallet: wallet.toLowerCase() });
    if (!user) return res.status(404).json({ error: "user_not_found" });

    const message = `Sign this message to authenticate with FinSightAI. Nonce: ${user.nonce}`;
    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== wallet.toLowerCase()) {
      return res.status(401).json({ error: "invalid_signature" });
    }

    // Update nonce after successful login
    user.nonce = Math.floor(Math.random() * 1000000).toString();
    await user.save();

    const token = jwt.sign({ sub: user._id, wallet: user.wallet }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token, user: { id: user._id, wallet: user.wallet } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "web3_verification_failed" });
  }
});

export default router;
