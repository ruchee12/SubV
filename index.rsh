'reach 0.1';
const [isOutcome, NUMBERGUESSED, NUMBERNOTGUESSED] = makeEnum(2)
const getwinner = (mainnum, guessnum) => {
    if (mainnum === guessnum) {
        return NUMBERGUESSED
    } else {
        return NUMBERNOTGUESSED
    }
}
assert(getwinner(1, 1) == NUMBERGUESSED)
assert(getwinner(1, 5) == NUMBERNOTGUESSED)
export const main = Reach.App(() => {
    const Alice = Participant('Alice', {
        ...hasRandom,
        Alicedetails: Fun([], Object({ nftid: Token, maxnumoftickets: UInt })),
        seedigest: Fun([Digest], Null),
        luckyticket: UInt
    });
    const Bobs = API('Bobs', {
        gettickets: Fun([UInt], Null)
    });
    init();

    Alice.only(() => {
        const { nftid, maxnumoftickets } = declassify(interact.Alicedetails())
    })
    Alice.publish(nftid, maxnumoftickets)
    commit()
    Alice.only(() => {
        const _luckynum = interact.luckyticket
        const [_commitluckynum, _saltluckynum] = makeCommitment(interact, _luckynum)
        const commitluckunum = declassify(_commitluckynum)
    })
    Alice.publish(commitluckunum)
    commit()

    Alice.only(() => {
        const seedig = declassify(interact.seedigest(commitluckunum))
    })
    Alice.publish(seedig)
    const storage = new Map(Address, UInt)
    const [i, all_address, all_tickets] =
        parallelReduce([0, Array.replicate(7, Alice), Array.replicate(7, 0)])
            .invariant(balance(nftid) == 0)
            .while(i < 7)
            .api(
                Bobs.gettickets,
                (ticket, verify) => {
                    verify(null)
                    const who = this
                    storage[who] = ticket
                    return [i + 1, all_address.set(i, who), all_tickets.set(i, ticket)]
                }
            )
    commit()
    Alice.only(() => {
        const saltluckynum = declassify(_saltluckynum)
        const luckynum = declassify(_luckynum)
    })
    Alice.publish(saltluckynum, luckynum)
    checkCommitment(commitluckunum, saltluckynum, luckynum)
    var [a, addds, tickets] = [0, all_address, all_tickets]
    invariant(balance(nftid) == 0)
    while (a < 7) {
        commit()
        Alice.publish()
        const outcome = getwinner(luckynum, tickets[a])
        const transfer_to_winner =
            outcome == NUMBERGUESSED ? 1 : 0
        if (transfer_to_winner == 1) {
            commit()
            Alice.pay([[1, nftid]])
            transfer([[1, nftid]]).to(addds[a])
            a = a + 1
            continue
        } else {
            a = a + 1
            continue
        }

    }
    transfer(balance()).to(Alice)
    commit()
    exit();
});
