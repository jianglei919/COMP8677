from sys import exit
from bitcoin.core.script import *

from bitcoin.core import x
from lib.utils import *
from lib.config import (alice_secret_key_BTC, my_public_key, my_address,
                    faucet_address, network_type)
from Q1 import send_from_P2PKH_transaction


######################################################################
# TODO: Complete the scriptPubKey implementation for question 5
Q2a_txout_scriptPubKey = [
    #**********write your scriptPubKey here********
    ] 
######################################################################

if __name__ == '__main__': 
    ######################################################################
    # TODO: set these parameters correctly
    amount_to_send = XXX # amount of BTC in the output you're sending minus fee
    txid_to_spend = (
        'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
    utxo_index = XXX # index of the output you are spending, indices start at 0
    ######################################################################

    response = send_from_P2PKH_transaction(
        amount_to_send, txid_to_spend, utxo_index,
        Q2a_txout_scriptPubKey, alice_secret_key_BTC, network_type)
    print(response.status_code, response.reason)
    print(response.text)
