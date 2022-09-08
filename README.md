## HundredNFTs

Le premier projet est le projet HundredNFTs.sol. Ce contract implémente la fonctionnalité de mint d'une collection de 100 NFT avec un prix minimum fixé à 0.001 ethers.

Ce premier contrat se déploie avec l'aide du fichier  `deployFirstContract.js` présent dans le dossier `scripts`

```shell
npx hardhat clean
npx hardhat compile
npx hardhat --network rinkeby run scripts/deployFirstContract.js
```
(j'utilise le réseau rinkeby pour déployer mes contrats)

Pour interagir avec le contrat une fois déployé il est possible d'utiliser le fichier `interact.js` ou `mint-nft.js` pour pouvoir respectivement voir le nombre de NFT qui ont été minté ou pour pouvoir minter un NFT.

#### Voir le nombre de NFT minté à ce jour :

Il faut créer un fichier `.env` à la racine du projet et y renseigner :

```env
PRIVATE_KEY=<your-private-key>
API_KEY = <your-api-key>
CONTRACT_ADDRESS = <contract-address>
```

Pour ma part j'utilise Alchemy en tant que provider, il sera donc plus simple d'utiliser Alchemy pour utiliser ce script.

Il vous reste ensuite à lancer la commande :

```shell
npx hardhat run scripts/interact.js --network rinkeby
```

#### Minter un NFT :

De la même manière que pour intéragir avec le contrat à l'aide de `ìnteract.js` il vous faudra créer un fichier `.env` à la racine de votre projet.

Il faudra en revanche rajouter cette fois dans ce fichier les lignes :

```
API_URL=<your-api-url>
PUBLIC_KEY=<your-public-key>
```
Dans ce premier contract c'est le minter qui prend à sa charge les frais de mint.


## LazyHundredNFTs

Etant donné que dans le premier Smart-contract c'est le propriétaire du contract qui a à sa charge les frais de mint, j'ai cherché une nouvelle façon de faire le contract afin que ce soit l'acheteur qui prenne les frais de mint à sa charge.

Après mes recherches j'en ai conclu que la méthode à utiliser était celle du lazy-minting.

Dans ce contrat, l'acheteur envoie un Voucher signé par le propriétaire du contrat, voucher contenant le prix du NFT et le NFT est minté à son adresse. C'est donc l'acheteur qui paie pour les frais de mint.

Ce contrat se déploie avec l'aide du fichier  `deploy.js` présent dans le dossier `scripts`

```shell
npx hardhat clean
npx hardhat compile
npx hardhat --network rinkeby run scripts/deploy.js
```

N'ayant pas réussi à interagir avec ce contrat en dehors de Remix, je vous invite à aller sur Remix. 
* Copiez collez l'intégralité du contrat `LazyHundredNFTs.sol` dans Remix.
* Compilez le contrat
* Déployez le avec la seconde adresse (0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2)
* Modifiez l'adresse du contrat dans le fichier `scripts\testRemix.js`
* Executez `npx hardhat run scripts/testRemix.js` 
* Copiez le résultat obtenu (ex : [0, "uri", "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", "0x0d1013238f8fea73cb62cf2833f404e0b3f01f133327e74c47a7fe195ecd398d157a755b38a83fb0db29e8c6cc053a4e2d754a20e1c1aa4e05d5aa31822ff0741c"])
* Vous pouvez maintenant tester les fonctionalités `recover` et `safeMint` en collant le résultat obtenu précédement sur Remix, dans les inputs prévu pour chaque fonctions

En suivant ces étapes vous minterez un NFT vers le premier wallet de remix (0x5B38Da6a701c568545dCfcB03FcB875f56beddC4)

Vous pourrez voir que le nombre total de NFT minté augmente (totalContent) et au delà de 3 NFT minté il n'est plus possible me niter un seul NFT.

Si vous souhaitez minter d'autres NFT avec les wallet proposé par Remix voici les addresse et leur clé privés pour pouvoir changer de wallet : https://ethereum.stackexchange.com/questions/78040/is-there-a-way-to-view-the-private-key-of-test-account-in-remix-javascript-vm


Vous devrez néamoins modifier la clé privé du signer et l'adresse dans le voucher, dans le script `testRemix.js`


