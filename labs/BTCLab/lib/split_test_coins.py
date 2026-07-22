from bitcoin import SelectParams
from bitcoin.core import CMutableTransaction, x
from bitcoin.core.script import CScript, SignatureHash, SIGHASH_ALL
from bitcoin.core.scripteval import VerifyScript, SCRIPT_VERIFY_P2SH

from bitcoin.wallet import CBitcoinSecret, P2PKHBitcoinAddress

from config import (my_private_key, my_public_key, my_address,
    alice_secret_key_BTC, alice_public_key_BTC, alice_address_BTC, 
    bob_secret_key_BTC, bob_public_key_BTC, bob_address_BTC,
    faucet_address, network_type)

from utils import create_txin, create_txout, broadcast_transaction



def split_coins(amount_to_send, txid_to_spend, utxo_index, n, network):
    #*******write your code for coin split**************#  
    

if __name__ == '__main__':
    SelectParams('testnet')

    ######################################################################
    # TODO: set these parameters correctly
    private_key = None
    public_key = private_key.pub
    address = P2PKHBitcoinAddress.from_pubkey(public_key)

    amount_to_send = None # amount of BTC in the output you're splitting minus fee
    txid_to_spend = (
        'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
    utxo_index = None # index of the output you are spending, indices start at 0
    n = None # number of outputs to split the input into
    # For n, choose a number larger than what you immediately need, 
    # in case you make mistakes.
    ######################################################################

    split_coins(amount_to_send, txid_to_spend, utxo_index, n, network_type)
