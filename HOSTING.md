# Hosting GeoSphere

## Home network

Run `run-public.bat`. Keep its terminal window open.

Windows may ask whether Node.js can communicate through the firewall. Allow private-network access. Other devices connected to the same router can open the IPv4 address printed by the launcher, followed by port `4173`.

Example:

`http://192.168.1.25:4173`

## Internet access

Listening on `0.0.0.0` makes the server reachable on the local network, but a router normally blocks incoming internet traffic.

For direct hosting:

1. Give the computer a stable local IP address.
2. Forward TCP port `4173` on the router to that computer.
3. Allow TCP port `4173` through Windows Firewall.
4. Give players the router's public IP address and port.

Direct port forwarding exposes the development server to the internet. A tunnel service such as Cloudflare Tunnel is generally safer because it supplies HTTPS and does not require opening a router port.

This server is suitable for sharing the current static game. Multiplayer state is not synchronized between players yet; each browser runs its own independent session.
