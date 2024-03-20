import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const saveImageToGallery = async (imageUri: string) => {
  try {
    const asset: any = await FileSystem.downloadAsync(
      imageUri, // URL of the image you want to save
      FileSystem.documentDirectory + 'image.jpg' // Local path where you want to save the image
    );

    if (asset.status === 200) {
      const album = 'MyCustomAlbum'; // Name of the album you want to create (optional)

      await MediaLibrary.createAssetAsync(asset.uri)
        .then(async () => {
          // Check if the album exists, and create it if it doesn't
          const albums = await MediaLibrary.getAlbumsAsync();
          const albumExists = albums.some((a) => a.title === album);

          if (!albumExists) {
            await MediaLibrary.createAlbumAsync(album, asset)
              .then(() => {
                alert('Image saved to gallery successfully.');
              })
              .catch((error) => {
                console.error('Error creating album:', error);
              });
          } else {
            await MediaLibrary.addAssetsToAlbumAsync([asset], album)
              .then(() => {
                alert('Image saved to gallery successfully.');
              })
              .catch((error) => {
                console.error('Error adding image to album:', error);
              });
          }
        })
        .catch((error) => {
          console.error('Error creating asset:', error);
        });
    } else {
      console.error('Failed to download image:', asset);
    }
  } catch (error) {
    console.error('Error saving image to gallery:', error);
  }
};
