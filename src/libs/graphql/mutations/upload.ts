import { gql } from '@apollo/client';

export const GENERATE_LOTTIE_UPLOAD_URL = gql`
  mutation generateUploadLottieURL($input: LottieUploadURLInput!) {
    generateUploadLottieURL(input: $input) {
      url
      id
    }
  }
`;
