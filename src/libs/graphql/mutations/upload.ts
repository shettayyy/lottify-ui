import { gql } from '@apollo/client';

export const GENERATE_LOTTIE_UPLOAD_URL = gql`
  mutation generateUploadLottieURL($input: LottieUploadURLInput!) {
    generateUploadLottieURL(input: $input) {
      url
      filename
      filesize
      animationId
      _id
    }
  }
`;

export const SAVE_LOTTIE_METADATA = gql`
  mutation saveLottieMetadata($input: LottieMetadataInput!) {
    saveLottieMetadata(input: $input)
  }
`;
