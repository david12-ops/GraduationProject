import axios from 'axios';
import { gql } from 'graphql-tag';
import { createSchema, createYoga } from 'graphql-yoga';
import { Context } from 'react';

import { IndexItem } from '../components-of-home/cards/types';

const typeDefs = gql`
  type Query {
    users: [User!]!
    githubUsers: [GithubUser!]!
    players: [Players!]!
    teams(league: String, season: String, team: String): [Teams!]!
    leagues: [Leagues!]!
    cardValues: [CardValue]!
  }
  type User {
    name: String
  }
  type GithubUser {
    id: ID!
    login: String!
    avatarUrl: String!
  }
  type Players {
    country: String!
    number: Int
    team: String!
    League: String!
    name: String!
    surname: String!
    playTime: Int
    Goals: Int
    Assists: Int
    position: Int
    session: Int
    id: Int
  }
  type Teams {
    season: String
    league: String
    team: String
  }
  type Leagues {
    name: String!
    country: String!
    teams: [String!]
  }
  type CardValue {
    id: Int
    title: String!
    description: String!
    image: String!
  }
`;

// type DbUser = {
//   name: String!
//   team: FirebaseFirestore.Document.Raference<team>
// }
// const db = firestore();

// dbUs: [DbUser]!
const resolvers = {
  Query: {
    users: async () => {
      // vybrat users
      return [{ name: 'Nextjs' }];
    },
    // usDb: async () => {
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    //   const usersRef = db.collection(
    //     'users',
    //   ) as FirebaseFirestore.CollectionReference<DbUser>;
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    //   const docsRefs = await usersRef.listDocuments();
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
    //   const docsSnapshotPromises = docsRefs.map((doc) => doc.get());
    //   const docsSnapshots = await Promise.all(docsSnapshotPromises);
    //   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    //   const docs = docsSnapshots.map((doc) => doc.data()!);
    //   console.log(docs);
    // },
    githubUsers: async () => {
      // eslint-disable-next-line no-useless-catch
      try {
        const users = await axios.get('https://api.github.com/users');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return users.data.map(({ id, login, avatar_url: avatarUrl }) => ({
          id,
          login,
          avatarUrl,
        }));
      } catch (error) {
        throw error;
      }
    },
    players: async () => {},
    leagues: async () => {},
    // eslint-disable-next-line @typescript-eslint/require-await
    cardValues: async () => {
      // eslint-disable-next-line no-lone-blocks
      {
        // eslint-disable-next-line no-useless-catch
        try {
          const indexItems: Array<IndexItem> = [
            {
              id: 1,
              image:
                'https://cdnuploads.aa.com.tr/uploads/Contents/2021/11/06/thumbs_b_c_c0f3083541183d22ac6e9ff1e20963bf.jpg?v=023244',
              title: 'Živé zápasy',
              description:
                'Nabízíme přehled odehrávajících se zápasu jako např. týmy, které spolu hrají, skore zápasu a čas hrací doby.',
            },
            {
              id: 2,
              image:
                'https://www.sportszion.com/wp-content/uploads/2020/08/Messi-Camp-Nou-compressed.jpg',
              title: 'Info o hráčích',
              description:
                'Nabízíme informace o hráčích jako jejich počet golu a assistencí v zápasech, které odehrály a za celou sezonu, v jakém týmu hrají, kolik jim je let, jméno a kde působili.',
            },
            {
              id: 3,
              image:
                'https://i2-prod.manchestereveningnews.co.uk/incoming/article18829527.ece/ALTERNATES/s615b/0_false-9PNG.png',
              title: 'Info o zápasu',
              description:
                'Nabízíme informace, které obsahahují držení míče hrajících týmů, počet střel mimo a na bránu, počet ne/úspěšných nahrávek, počet golu, hráči, ktteří hrají v základní sestavě i na lavičce i v rezervách a zraněné.',
            },
            {
              id: 4,
              image: 'https://pbs.twimg.com/media/FmcHmGlWYAIk9V0.jpg',
              title: 'Info o týmech',
              description:
                'Naleznete zde tabulku týmů hrajících v dané soutěži. Budou tam informace typu počet vítězství, remíz a proher, počet bodů a celkový součet podle, kterého se týmy umisťují na daných příčkách.',
            },
          ];

          const values = indexItems; // get(odkaz na api)
          return values.map(({ id, image, title, description }) => ({
            id,
            image,
            title,
            description,
          }));
          // eslint-disable-next-line sonarjs/no-useless-catch
        } catch (error) {
          throw error;
        }
      }
    },
  },
};

const schema = createSchema({
  typeDefs,
  resolvers,
});

export const config = {
  api: {
    // Disable body parsing (required for file uploads)
    bodyParser: false,
  },
};
export default createYoga({
  schema,
  // Needed to be defined explicitly because our endpoint lives at a different path other than `/graphql`
  graphqlEndpoint: '/api/graphql',
  context: async (context) => {
    const auth = context.request.headers.get('authorization');
    console.log(auth);
    return {
      user: auth ? await verifyToken(auth) : undefined,
    } as Context;
  },
});
function verifyToken(auth: string) {
  throw new Error('Function not implemented.');
}
