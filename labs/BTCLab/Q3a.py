from sys import exit
from bitcoin.core.script import *
from bitcoin.wallet import CBitcoinSecret

from lib.utils import *
from lib.config import (my_private_key, my_public_key, my_address,
                    faucet_address, network_type)
from Q1 import send_from_P2PKH_transaction


cust1_private_key = CBitcoinSecret(
    'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
cust1_public_key = cust1_private_key.pub
cust2_private_key = CBitcoinSecret(
    'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
cust2_public_key = cust2_private_key.pub
cust3_private_key = CBitcoinSecret(
    'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
cust3_public_key = cust3_private_key.pub


######################################################################
# TODO: Complete the scriptPubKey implementation for Question 6

# You can assume the role of the bank for the purposes of this problem
# and use my_public_key and my_private_key in lieu of bank_public_key and
# bank_private_key.

Q3a_txout_scriptPubKey = [
   #***********write your scriptPubKey here************
]
######################################################################

if __name__ == '__main__':
    ######################################################################
    # TODO: set these parameters correctly
    amount_to_send = XXX # amount of BTC in the output you're sending minus fee
    txid_to_spend = (
        'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
    utxo_index = XXX # index of the output you are spending, indices start at 0
    ######################################################################

    response = send_from_P2PKH_transaction(amount_to_send, txid_to_spend, 
        utxo_index, Q3a_txout_scriptPubKey, my_private_key, network_type)
    print(response.status_code, response.reason)
    print(response.text)
