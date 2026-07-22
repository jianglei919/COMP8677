from bitcoin import SelectParams
from bitcoin.base58 import decode
from bitcoin.core import x
from bitcoin.wallet import CBitcoinAddress, CBitcoinSecret, P2PKHBitcoinAddress


SelectParams('testnet')

faucet_address = CBitcoinAddress('n28sxHLsfAiDVLMkX2niouSdYwJ54EqLMU')

# we are using 'btc-test3' network.
network_type = 'btc-test3'


######################################################################
# TODO: Fill this in with your private key.
#
# Create a private key and address pair in Base58 with keygen.py
# Send coins at https://testnet-faucet.mempool.co/

my_private_key = CBitcoinSecret(
    'cW2tV57KYkxiJmNB3QwqxKSzKByMCq38qfctPKVb4JN6MVo3kEBm')

my_public_key = my_private_key.pub
my_address = P2PKHBitcoinAddress.from_pubkey(my_public_key)
######################################################################


######################################################################
# TODO: Fill this in with address secret key for BTC testnet3
#
# Create address in Base58 with keygen.py
# Send coins at https://testnet-faucet.mempool.co/

alice_secret_key_BTC = CBitcoinSecret(
    'cT68aDQFUS8aRoKcKvtArFqF4uBszC7KxeXaqRFB9sYDDUy17TgQ')

bob_secret_key_BTC = CBitcoinSecret(
    'cNixAmKriqFZDnEYmoMq7B412MoZZ8hFSV7V1rq9VTHpS6NWYPGV')

alice_public_key_BTC = alice_secret_key_BTC.pub
alice_address_BTC = P2PKHBitcoinAddress.from_pubkey(alice_public_key_BTC)

bob_public_key_BTC = bob_secret_key_BTC.pub
bob_address_BTC = P2PKHBitcoinAddress.from_pubkey(bob_public_key_BTC)
######################################################################


