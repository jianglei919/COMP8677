! /usr/bin/python3
# this program tells you how to  create a multi-thread TCP server using _thread module 

from socket import *
from _thread import *

serverPort = 12000
serverSocket = socket(AF_INET, SOCK_STREAM)
serverSocket.bind(("", serverPort))
serverSocket.listen(1)

print("The server is ready to receive")

def multi_threaded_client(connectionSocket):  #this is where you define the code to handle a  TLS client. 
    sentence = connectionSocket.recv(1024) #in this example, server change client message to upper case letter and send back.  
    while sentence:
          capitalizedSentence = sentence.decode().upper()
          connectionSocket.send(capitalizedSentence.encode())
          print(sentence.decode()) 
          sentence = connectionSocket.recv(1024)
    connectionSocket.close()


while True:
    connectionSocket, addr = serverSocket.accept()
    start_new_thread(multi_threaded_client, (connectionSocket, ))  # a new server instance is assigned to this new client. 

