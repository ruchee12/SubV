import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';

const stdlib = loadStdlib(process.env);

const startingBalance = stdlib.parseCurrency(100);
const accAlice = await stdlib.newTestAccount(startingBalance)
const accBobs = await stdlib.newTestAccounts(10, startingBalance);
const theNFT = await stdlib.launchToken(accAlice, "theNFT", "theNFT1", { supply: 1 });
console.log('Hello, Alice and Bobs!');

console.log('Launching...');
const ctcAlice = accAlice.contract(backend);

const showBalance = async (acc, name) => {
    const amt = await stdlib.balanceOf(acc);
    const amtNFT = await stdlib.balanceOf(acc, theNFT.id);
    console.log(`${name} has ${stdlib.formatCurrency(amt)} ${stdlib.standardUnit} and ${amtNFT} of the NFT`);
};
const ctcWho = (who) =>
    who.contract(backend, ctcAlice.getInfo());

const Bobs = async (whoi, num) => {
    try {
        const ctc = ctcWho(whoi);
        whoi.tokenAccept(theNFT.id)
        await ctc.apis.Bobs.gettickets(parseInt(num));

    } catch (error) {
        console.log('sorry the max amount of raffle entries have een reached');
    }

}


console.log('Starting backends...');
await showBalance(accAlice, 'Alice')
await showBalance(accBobs[0], 'Bob1')
await showBalance(accBobs[1], 'Bob2')
await showBalance(accBobs[2], 'Bob3')
await showBalance(accBobs[3], 'Bob4')
await showBalance(accBobs[4], 'Bob5')
await showBalance(accBobs[5], 'Bob6')
await showBalance(accBobs[6], 'Bob7')
await showBalance(accBobs[7], 'Bob8')
await showBalance(accBobs[8], 'Bob9')
await Promise.all([
    backend.Alice(ctcAlice, {
        ...stdlib.hasRandom,
        Alicedetails: async () => {
            return {
                nftid: theNFT.id,
                maxnumoftickets: parseInt(7)
            }
        },

        luckyticket: parseInt(45),
        seedigest: async (digestt) => {
            console.log(` The hashed value: ${digestt}`)
        },
    }),
    await Bobs(accBobs[0], 12),
    await Bobs(accBobs[1], 223),
    await Bobs(accBobs[2], 1),
    await Bobs(accBobs[3], 45),
    await Bobs(accBobs[4], 17),
    await Bobs(accBobs[5], 36),
    await Bobs(accBobs[6], 7),
    await Bobs(accBobs[7], 4),

]);
await showBalance(accBobs[0], 'Bob1')
await showBalance(accBobs[1], 'Bob2')
await showBalance(accBobs[2], 'Bob3')
await showBalance(accBobs[3], 'Bob4')
await showBalance(accBobs[4], 'Bob5')
await showBalance(accBobs[5], 'Bob6')
await showBalance(accBobs[6], 'Bob7')
await showBalance(accBobs[7], 'Bob8')
await showBalance(accBobs[8], 'Bob9')


process.exit()
