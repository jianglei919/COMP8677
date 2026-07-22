"""BlockCypher's testnet3 node is ~82k blocks out of sync and rejects valid
spends as 'orphaned'. This helper rebuilds the SAME signed transaction the
Q*.py scripts produce and pushes the raw hex to mempool.space instead, which
has a properly synced testnet3 node.

Usage: build the tx exactly as the lab does, then push it here.
"""
import sys
import requests
from bitcoin.core import b2x


def broadcast_via_mempool(tx):
    raw = b2x(tx.serialize())
    r = requests.post('https://mempool.space/testnet/api/tx',
                      data=raw, timeout=30)
    print('push status:', r.status_code)
    print('response   :', r.text)
    if r.status_code == 200:
        print('broadcast txid:', r.text.strip())
    return r


if __name__ == '__main__':
    # Rebuild Q1's signed P2PKH transaction (no BlockCypher involved).
    from bitcoin.wallet import P2PKHBitcoinAddress
    from lib.utils import (create_txin, create_txout,
                           create_signed_transaction)
    from lib.config import my_private_key, faucet_address
    from Q1 import P2PKH_scriptPubKey, P2PKH_scriptSig

    amount_to_send = 0.0014
    txid_to_spend = '1f20ede07986fd311954c31d9052d3b8551b72a85535a7dd2fb87489e9ba77bc'
    utxo_index = 0

    sender_public_key = my_private_key.pub
    sender_address = P2PKHBitcoinAddress.from_pubkey(sender_public_key)

    txout_scriptPubKey = P2PKH_scriptPubKey(faucet_address)
    txout = create_txout(amount_to_send, txout_scriptPubKey)

    txin_scriptPubKey = P2PKH_scriptPubKey(sender_address)
    txin = create_txin(txid_to_spend, utxo_index)
    txin_scriptSig = P2PKH_scriptSig(txin, txout, txin_scriptPubKey,
                                     my_private_key, sender_public_key)

    # runs VerifyScript internally; raises if the script is invalid
    new_tx = create_signed_transaction(txin, txout, txin_scriptPubKey,
                                       txin_scriptSig)
    broadcast_via_mempool(new_tx)
