import React, { useCallback, useState } from 'react'

// material-ui
import {
  Avatar,
  Box,
  Stack,
  Typography
} from '@mui/material'
import { SxProps, useTheme } from '@mui/material/styles';

// thirds-party
import { useDropzone } from 'react-dropzone';

// project imports
import Iconify from 'components/iconify';

type ValidatorResult = {
  code: string;
  message: string;
} | null;

type Validator = (file: { name: string, size: number }) => ValidatorResult;

type UploadAvatarProps = {
  helperText?: React.ReactNode;
  sx?: SxProps;
  file: File | string | null;
  onDrop: (acceptedFiles: File[]) => void;
  accept: { [key: string]: string[] } | "image/*";
  multiple?: boolean;
  maxFiles?: number;
  validator: Validator;
  variant?: "circular" | "square" | "rounded"
}

const UploadAvatar: React.FC<UploadAvatarProps> = ({
  helperText,
  sx = {},
  accept,
  file,
  onDrop,
  multiple = false,
  maxFiles = 0,
  validator,
  variant = "circular"
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const handleUploadPhotoHover = useCallback(() => {
    setIsHovered(true);
  }, []);
  const handleUploadPhotoLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  //@ts-ignore
  const { fileRejections, getRootProps, getInputProps } = useDropzone({
    onDrop,
    //@ts-ignore
    accept: accept,
    multiple: multiple,
    maxFiles: maxFiles,
    validator: validator
  });

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <Typography key={file.name} variant='h7' color={theme.palette.errorCustom.main} fontFamily={"Sarabun-SemiBold"}>
      {errors.map(e => (
        <p key={e.code}>*{e.message}*</p>
      ))}
    </Typography>
  ));

  const fileNotFounded = (
    <Typography variant='h7' color={theme.palette.errorCustom.main} mt={2} fontFamily={"Sarabun-SemiBold"}>
      *กรุณาใส่ไฟล์รูปภาพ*
    </Typography>
  );

  return (
    <Box textAlign="center" mt={1} sx={{ ...sx }}>
      <Avatar
        id="upload-photo-container"
        sx={{
          minWidth: 130,
          width: '100%',
          maxWidth: 200,
          height: { xs: 130, md: 200 },
          cursor: 'pointer',
          border: `8px solid ${theme.palette.grey[300]}`,
          borderInline: `8px solid ${theme.palette.grey[400]}`,
          backgroundColor: file ? 'transparent' : '#f6f7f8',
        }}
        variant={variant}
        onMouseEnter={handleUploadPhotoHover}
        onMouseLeave={handleUploadPhotoLeave}
        {...getRootProps()}
      >
        <input {...getInputProps()} accept="image/*" />
        {file ? (
          <>
            <img
              src={typeof file == "string" ? file : URL.createObjectURL(file)}
              alt="Uploaded"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {isHovered && (
              <>
                <Box
                  sx={{
                    bgcolor: 'black',
                    opacity: 0.4,
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    zIndex: 1,
                  }}
                />
                <Stack
                  direction="column"
                  color="white"
                  alignItems="center"
                  position="absolute"
                  zIndex="2"
                >
                  <Iconify icon="solar:camera-add-bold" width={30} color={"white"} />
                  <Typography
                    variant="h6"
                    fontFamily="Sarabun-SemiBold"
                    color="white"
                  >
                    Upload Photo
                  </Typography>
                </Stack>
              </>
            )}
          </>
        ) : (
          <Stack direction={'column'} color={'black'} alignItems={'center'}>
            <Iconify icon="solar:camera-add-bold-duotone" color={theme.palette.icon.drawer} width={30} />
            <Typography variant='h6' fontFamily={"Sarabun-SemiBold"}>Upload Photo</Typography>
          </Stack>
        )}
      </Avatar>
      {helperText}
      {!file ? fileNotFounded : fileRejectionItems}
    </Box>
  )
}

export default UploadAvatar