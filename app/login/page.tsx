
"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    // Frontend demonstration only.
    // Connect this form to your authentication API later.
    setTimeout(() => {
      setLoading(false);
      setError(
        "Login is not connected to the backend yet. Please try again after authentication is implemented."
      );
    }, 500);
  }

  return (
    <main className="login-page">
      <section className="login-visual">
        <Link href="/" className="brand">
          <span className="brand-icon">E</span>
          <span>Enjera<span className="brand-accent">Go</span></span>
        </Link>

        <div className="visual-content">
          <span className="eyebrow">A TASTE OF ETHIOPIA</span>
          <h1>
            Your favorite Ethiopian food,
            <span> delivered with love.</span>
          </h1>
          <p>
            From warm injera and traditional wot to your favorite local
            restaurants, discover delicious food right at your doorstep.
          </p>

          <div className="food-art" aria-label="Illustration of Ethiopian food">
            <div className="food-circle">
              <span className="food-emoji">🍽️</span>
            </div>
            <span className="floating-food food-one">🌶️</span>
            <span className="floating-food food-two">🥘</span>
            <span className="floating-food food-three">🌿</span>
          </div>

          <div className="visual-footer">
            <span className="footer-dot" />
            Bringing Ethiopia's flavors closer to you.
          </div>
        </div>
      </section>

      <section className="login-content">
        <div className="mobile-brand">
          <Link href="/" className="brand">
            <span className="brand-icon">E</span>
            <span>Enjera<span className="brand-accent">Go</span></span>
          </Link>
        </div>

        <div className="login-card">
          <div className="welcome-icon">👋</div>
          <p className="welcome-label">WELCOME BACK</p>
          <h2>Sign in to EnjeraGo</h2>
          <p className="login-description">
            Good food is just a few clicks away.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-field">
              <label htmlFor="email">Email address</label>
              <div className="input-wrapper">
                <span className="input-icon">✉</span>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </div>

            <div className="form-field">
              <div className="password-label">
                <label htmlFor="password">Password</label>
                <Link href="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>

              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div className="error-message" role="alert">
                <span>!</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <span>→</span>}
            </button>
          </form>

          <div className="divider">
            <span>YOUR NEXT MEAL AWAITS</span>
          </div>

          <p className="register-prompt">
            New to EnjeraGo?{" "}
            <Link href="/register">Create an account</Link>
          </p>

          <p className="terms">
            By continuing, you agree to our{" "}
            <Link href="/terms">Terms of Service</Link> and{" "}
            <Link href="/privacy">Privacy Policy</Link>.
          </p>
        </div>

        <p className="copyright">
          © 2025 EnjeraGo. Made with ♥ in Ethiopia.
        </p>
      </section>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #fff;
          color: #25251f;
          font-family: Arial, Helvetica, sans-serif;
        }

        .login-visual {
          position: relative;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          padding: 42px 8%;
          color: white;
          background:
            radial-gradient(circle at 80% 15%, #ef8b4938 0, transparent 30%),
            linear-gradient(145deg, #202a20, #263c2b 55%, #17251b);
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          width: fit-content;
          color: inherit;
          text-decoration: none;
          font-size: 25px;
          font-weight: 800;
          letter-spacing: -1px;
        }

        .brand-icon {
          display: grid;
          width: 39px;
          height: 39px;
          place-items: center;
          border-radius: 12px;
          background: #f28a45;
          color: white;
          font-size: 25px;
          font-weight: 900;
        }

        .brand-accent {
          color: #f28a45;
        }

        .visual-content {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 570px;
          margin: auto;
          padding: 55px 0 25px;
        }

        .eyebrow {
          display: inline-block;
          padding: 9px 13px;
          border: 1px solid #ffffff35;
          border-radius: 30px;
          color: #ffbc8b;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .visual-content h1 {
          margin: 25px 0 18px;
          font-size: clamp(36px, 4vw, 59px);
          line-height: 1.12;
          letter-spacing: -2px;
        }

        .visual-content h1 span {
          color: #f6a064;
        }

        .visual-content > p {
          max-width: 430px;
          color: #e1e8df;
          font-size: 15px;
          line-height: 1.9;
        }

        .food-art {
          position: relative;
          display: grid;
          min-height: 240px;
          place-items: center;
          margin-top: 15px;
        }

        .food-circle {
          display: grid;
          width: 185px;
          height: 185px;
          place-items: center;
          border: 1px solid #ffffff35;
          border-radius: 50%;
          background: #ffffff0b;
          box-shadow: 0 0 0 20px #ffffff05, 0 0 0 42px #ffffff04;
        }

        .food-emoji {
          font-size: 105px;
          filter: drop-shadow(0 14px 15px #00000040);
        }

        .floating-food {
          position: absolute;
          display: grid;
          width: 57px;
          height: 57px;
          place-items: center;
          border: 1px solid #ffffff30;
          border-radius: 18px;
          background: #ffffff16;
          font-size: 28px;
          backdrop-filter: blur(8px);
        }

        .food-one {
          top: 35px;
          left: 17%;
          transform: rotate(-12deg);
        }

        .food-two {
          right: 15%;
          top: 28px;
          transform: rotate(12deg);
        }

        .food-three {
          bottom: 18px;
          right: 25%;
          transform: rotate(-8deg);
        }

        .visual-footer {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #d4dfd1;
          font-size: 12px;
        }

        .footer-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #f6a064;
        }

        .login-content {
          display: flex;
          min-width: 0;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 45px 7% 25px;
        }

        .mobile-brand {
          display: none;
        }

        .login-card {
          width: 100%;
          max-width: 430px;
          margin: auto 0;
        }

        .welcome-icon {
          display: grid;
          width: 49px;
          height: 49px;
          place-items: center;
          border-radius: 15px;
          background: #fff0e6;
          font-size: 24px;
        }

        .welcome-label {
          margin: 28px 0 9px;
          color: #d97935;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .login-card h2 {
          margin: 0;
          color: #25251f;
          font-size: clamp(25px, 2.5vw, 34px);
          font-weight: 800;
          letter-spacing: -1px;
        }

        .login-description {
          margin: 12px 0 30px;
          color: #85857d;
          font-size: 14px;
        }

        .form-field {
          margin-bottom: 21px;
        }

        .form-field label {
          display: block;
          margin-bottom: 9px;
          color: #34352e;
          font-size: 13px;
          font-weight: 700;
        }

        .password-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .forgot-link,
        .register-prompt a,
        .terms a {
          color: #d97935;
          font-weight: 700;
          text-decoration: none;
        }

        .forgot-link {
          margin-bottom: 9px;
          font-size: 12px;
        }

        .input-wrapper {
          display: flex;
          min-height: 53px;
          align-items: center;
          gap: 11px;
          padding: 0 14px;
          border: 1px solid #e5e5de;
          border-radius: 12px;
          background: #fff;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .input-wrapper:focus-within {
          border-color: #dc874b;
          box-shadow: 0 0 0 3px #dc874b20;
        }

        .input-icon {
          color: #96968c;
          font-size: 16px;
        }

        .input-wrapper input {
          width: 100%;
          min-width: 0;
          border: none;
          outline: none;
          background: transparent;
          color: #25251f;
          font-size: 13px;
        }

        .input-wrapper input::placeholder {
          color: #aaa99f;
        }

        .password-toggle {
          border: none;
          background: none;
          color: #d97935;
          cursor: pointer;
          font-size: 12px;
          font-weight: 700;
        }

        .error-message {
          display: flex;
          gap: 9px;
          margin: 0 0 16px;
          padding: 12px;
          border: 1px solid #f2caca;
          border-radius: 9px;
          background: #fff3f3;
          color: #a52d2d;
          font-size: 12px;
          line-height: 1.6;
        }

        .error-message span {
          display: grid;
          width: 18px;
          height: 18px;
          flex-shrink: 0;
          place-items: center;
          border-radius: 50%;
          background: #a52d2d;
          color: white;
          font-weight: 800;
        }

        .login-button {
          display: flex;
          width: 100%;
          min-height: 54px;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 8px;
          border: none;
          border-radius: 12px;
          background: #e98240;
          color: white;
          cursor: pointer;
          font-size: 14px;
          font-weight: 800;
          box-shadow: 0 7px 18px #e9824030;
          transition: background 0.2s, transform 0.2s;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          background: #d96f2e;
        }

        .login-button:disabled {
          cursor: wait;
          opacity: 0.7;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 28px 0;
          color: #a2a298;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.2px;
        }

        .divider::before,
        .divider::after {
          height: 1px;
          flex: 1;
          background: #e9e9e2;
          content: "";
        }

        .register-prompt {
          text-align: center;
          color: #77776f;
          font-size: 13px;
        }

        .terms {
          margin-top: 32px;
          color: #9a9a91;
          font-size: 11px;
          line-height: 1.8;
          text-align: center;
        }

        .copyright {
          margin: 35px 0 0;
          color: #a1a198;
          font-size: 11px;
          text-align: center;
        }

        @media (max-width: 850px) {
          .login-page {
            grid-template-columns: 0.85fr 1.15fr;
          }

          .login-visual {
            padding-right: 7%;
            padding-left: 7%;
          }

          .visual-content h1 {
            font-size: 38px;
          }

          .food-circle {
            width: 145px;
            height: 145px;
          }

          .food-emoji {
            font-size: 80px;
          }
        }

        @media (max-width: 650px) {
          .login-page {
            display: block;
            min-height: 100vh;
            background: #fafaf7;
          }

          .login-visual {
            display: none;
          }

          .login-content {
            min-height: 100vh;
            padding: 25px 22px;
          }

          .mobile-brand {
            display: block;
            width: 100%;
            max-width: 430px;
            margin: 0 auto 35px;
            color: #253426;
          }

          .login-card {
            max-width: 430px;
            padding: 28px 22px;
            border: 1px solid #efeee7;
            border-radius: 20px;
            background: #fff;
            box-shadow: 0 10px 40px #292d1c08;
          }

          .welcome-label {
            margin-top: 22px;
          }

          .copyright {
            margin-top: 24px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .input-wrapper,
          .login-button {
            transition: none;
          }
        }
      `}</style>
    </main>
  );
}
