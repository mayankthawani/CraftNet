"use client";

import React, { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const formatPhoneToEmail = (phoneNumber) => {
    // Remove any non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, "");

    // Validate Indian phone number (10 digits starting with 6-9)
    if (cleaned.length === 10 && /^[6-9]/.test(cleaned)) {
      return `${cleaned}@gmail.com`;
    }

    return null;
  };

  const handleLogin = async () => {
    if (!phone.trim()) {
      alert("Please enter your phone number");
      return;
    }

    if (!password.trim()) {
      alert("Please enter your password");
      return;
    }

    const email = formatPhoneToEmail(phone);
    if (!email) {
      alert(
        "Please enter a valid 10-digit Indian mobile number starting with 6-9"
      );
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      alert("Login successful! Welcome back!");
      console.log("User logged in:", user);

      // TODO: Redirect to dashboard or home page
    } catch (error) {
      console.error("Error logging in:", error);

      // Handle specific error cases
      if (error.code === "auth/user-not-found") {
        alert("No account found with this phone number. Please sign up first.");
      } else if (error.code === "auth/wrong-password") {
        alert("Incorrect password. Please try again.");
      } else if (error.code === "auth/invalid-email") {
        alert("Invalid phone number format. Please try again.");
      } else if (error.code === "auth/user-disabled") {
        alert("This account has been disabled. Please contact support.");
      } else {
        alert("Failed to log in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">🏺</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Welcome Back
          </CardTitle>
          <p className="text-gray-600">Sign in to CraftNet</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <Input
              type="tel"
              placeholder="Enter your 10-digit mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="text-lg"
              maxLength={10}
            />
            <p className="text-xs text-gray-500 mt-1">
              Example: 9876543210 (same number you used to sign up)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-lg"
            />
          </div>

          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-3 text-lg font-semibold"
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-orange-600 hover:text-orange-700 font-medium underline"
              >
                Sign Up
              </Link>
            </p>
          </div>

          <div className="text-center">
            <Link
              href="/forgot-password"
              className="text-sm text-orange-600 hover:text-orange-700 underline"
            >
              Forgot Password?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
