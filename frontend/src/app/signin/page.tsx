"use client";
import React from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

const SigninPage = () => {
  return (
    <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto max-w-[500px] rounded bg-white px-6 py-10 shadow-three dark:bg-dark sm:p-[60px]">
              <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                Sign in to your account
              </h3>
              <p className="mb-11 text-center text-base font-medium text-body-color">
                Login to your account for a faster checkout.
              </p>
              <button
                onClick={() => signIn("google")}
                className="border-stroke mb-6 flex w-full items-center justify-center rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:text-primary dark:text-body-color-dark dark:shadow-two"
              >
                Sign in with Google
              </button>
              <p className="text-center text-base font-medium text-body-color">
                {"Don't have an account? "}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SigninPage;
