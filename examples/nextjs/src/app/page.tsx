import Image from "next/image";
import { css } from "../../styled-system/css";
import { DarkModeToggle } from "./components/dark-mode-toggle";

export default function Home() {
  return (
    <div
      className={css({
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-geist-sans)",
        bg: "gray.1",
        _dark: {
          bg: "gray.dark.1",
        },
      })}
    >
      <main
        className={css({
          display: "flex",
          minHeight: "100vh",
          width: "100%",
          maxWidth: "800px",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          bg: "gray.2",
          _dark: {
            bg: "gray.dark.2",
          },
          padding: { base: "48px 24px", md: "120px 60px" },
          position: "relative",
        })}
      >
        <div
          className={css({
            position: "absolute",
            top: { base: "24px", md: "60px" },
            right: { base: "24px", md: "60px" },
          })}
        >
          <DarkModeToggle />
        </div>
        <Image
          className={css({
            filter: { _dark: "invert()" },
          })}
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            textAlign: "left",
            gap: { base: "16px", md: "24px" },
          })}
        >
          <h1
            className={css({
              maxWidth: "320px",
              fontSize: { base: "32px", md: "40px" },
              fontWeight: "600",
              lineHeight: { base: "40px", md: "48px" },
              letterSpacing: { base: "-1.92px", md: "-2.4px" },
              textWrap: "balance",
              color: "gray.12",
              _dark: {
                color: "gray.dark.12",
              },
            })}
          >
            To get started, edit the page.tsx file.
          </h1>
          <p
            className={css({
              maxWidth: "440px",
              fontSize: "18px",
              lineHeight: "32px",
              textWrap: "balance",
              color: "gray.11",
              _dark: {
                color: "gray.dark.11",
              },
            })}
          >
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
              className={css({
                fontWeight: "500",
                color: "blue.11",
                _dark: {
                  color: "blue.dark.11",
                },
                _hover: {
                  color: "blue.12",
                  _dark: {
                    color: "blue.dark.12",
                  },
                },
              })}
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
              className={css({
                fontWeight: "500",
                color: "blue.11",
                _dark: {
                  color: "blue.dark.11",
                },
                _hover: {
                  color: "blue.12",
                  _dark: {
                    color: "blue.dark.12",
                  },
                },
              })}
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div
          className={css({
            display: "flex",
            flexDirection: "row",
            width: "100%",
            maxWidth: "440px",
            gap: "16px",
            fontSize: "14px",
          })}
        >
          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={css({
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "40px",
              padding: "0 16px",
              borderRadius: "128px",
              border: "1px solid transparent",
              transition: "0.2s",
              cursor: "pointer",
              width: "fit-content",
              fontWeight: "500",
              bg: "gray.12",
              color: "gray.1",
              _dark: {
                bg: "gray.dark.12",
                color: "gray.dark.1",
              },
              gap: "8px",
              _hover: {
                bg: "gray.11",
                _dark: {
                  bg: "gray.dark.11",
                },
                borderColor: "transparent",
              },
            })}
          >
            <Image
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
              className={css({
                filter: { _dark: "invert()" },
              })}
            />
            Deploy Now
          </a>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={css({
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "40px",
              padding: "0 16px",
              borderRadius: "128px",
              border: "1px solid",
              borderColor: "gray.6",
              _dark: {
                color: "gray.dark.12",
                borderColor: "gray.dark.6",
              },
              transition: "0.2s",
              cursor: "pointer",
              width: "fit-content",
              fontWeight: "500",
              color: "gray.12",
              _hover: {
                bg: "gray.3",
                _dark: {
                  bg: "gray.dark.3",
                },
                borderColor: "transparent",
              },
            })}
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
