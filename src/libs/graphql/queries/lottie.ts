import { gql } from '@apollo/client';

export const GET_LOTTIES = gql`
  query getLotties($input: GetLottieParams) {
    lotties(input: $input) {
      result {
        _id
        filename
        filesize
        url
      }
      metadata {
        pagination {
          nextPage
        }
      }
    }
  }
`;
