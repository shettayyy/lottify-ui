import { gql } from '@apollo/client';

export const GET_LOTTIES = gql`
  query GetLotties($input: GetLottieParams) {
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

export const GET_LOTTIE = gql`
  query GetLottie($input: GetLottieInput!) {
    lottie(input: $input) {
      _id
      filename
      filesize
      url
      uploadStatus
      metadata {
        author
        description
        generator
        width
        height
        frameRate
        layerCount
        duration
        totalFrames
        userFilename
      }
    }
  }
`;
