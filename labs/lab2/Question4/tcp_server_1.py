import socket
import time

# Server configuration
HOST = ''  # Empty string means listen on all network interfaces
PORT = 4000  # Port to listen on
TIMEOUT = 15  # Client command timeout in seconds
BUFFER_SIZE = 1024  # Receive buffer size

# Create welcome socket
ss = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Allow port reuse to avoid "Address already in use" errors when restarting quickly
ss.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

# Bind the socket to the address and port, and start listening
ss.bind((HOST, PORT))
ss.listen(1)
print(f"Server is listening on port {PORT}...\n")

# Flag: controls whether the server continues to run
server_running = True

while server_running:
    print("Waiting for a new connection...\n")

    # Accept a new connection, returning a new socket and the client address (IP, port)
    new_sock, addr = ss.accept()
    client_ip, client_port = addr
    print(f"Connected by {client_ip}:{client_port}\n")

    # Step 1: Tell the client its own IP address and port
    welcome_msg = f"Your IP address is {client_ip}, your port number is {client_port}\n"
    new_sock.send(welcome_msg.encode())

    # Set 15 seconds timeout
    new_sock.settimeout(TIMEOUT)

    # Enter command processing loop
    while True:
        try:
            data = new_sock.recv(BUFFER_SIZE)

            # If the client actively closes the connection, recv returns an empty byte string
            if len(data) == 0:
                print("Client closed the connection.\n")
                break

            # Decode and strip whitespace (remove newlines, etc.)
            command = data.decode().strip()
            print(f"Received command: {command}\n")

            # Process commands
            if command == "TIME":
                # Return current time string
                current_time = time.ctime()
                new_sock.send(current_time.encode() +"\n".encode())

            elif command == "EXIT":
                # Exit: respond to client, then shutdown the server
                new_sock.send("Server is shutting down.\n".encode())
                server_running = False
                break

            else:
                # Invalid command
                new_sock.send("Invalid command!\n".encode())

        except socket.timeout:
            # No command received within 15 seconds
            print("Connection timed out (no command in 15 seconds).\n")
            break

        except ConnectionResetError:
            # Client connection disconnected unexpectedly
            print("Client connection was reset.\n")
            break

    # Close current client socket, prepare to accept the next client
    new_sock.close()
    print("Current client socket closed.\n")

# Close welcome socket, server fully shuts down
ss.close()
print("Welcome socket closed. Server has shut down.\n")
