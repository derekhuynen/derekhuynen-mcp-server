# Security Policy

## Reporting a vulnerability

This project serves only public, read-only profile data and runs without authentication by
design. If you find a security issue (for example in the HTTP transport, dependency chain, or
build), please report it privately:

- Email: derek.huynen@gmail.com

Please do not open a public issue for security reports. You can expect an initial response
within a few days.

## Scope

The HTTP endpoint exposes public data and is protected by rate limiting and CORS. There is no
authentication because there is no private data to protect. Reports about the absence of auth on
public data are out of scope.
