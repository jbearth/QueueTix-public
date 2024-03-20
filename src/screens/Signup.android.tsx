import React from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/core';

import { useData, useTheme, useTranslation } from '../hooks';
import { Block, Button, Input, Image, Text, Checkbox } from '../components';
import { Formik } from 'formik';
import * as Yup from 'yup';

const isAndroid = Platform.OS === 'android';


const Signup = () => {
  const { isDark } = useData();
  const { t } = useTranslation();
  const navigation: any = useNavigation();

  const { assets, colors, gradients, sizes } = useTheme();

  const SignInSchema = Yup.object().shape({
    name: Yup.string().max(35, 'ตั้งชื่อได้มากสุด 35 อักขระ').required('กรุณาใส่ชื่อผู้ใช้'),
    email: Yup.string()
      .matches(/^[^\s@]+@[^\s@]+\.(com)+$/, { message: "ใส่อีเมลให้ถูกต้อง" })
      .max(100)
      .required('กรุณาใส่อีเมล'),
    password: Yup.string()
      .min(8, 'ใส่รหัสผ่านอย่างน้อย 8 อักขระ')
      .max(16, 'ใส่รหัสผ่านได้มากสูด 16 อักขระ')
      .required('กรุณาใส่รหัสผ่าน'),
    checked: Yup.boolean().oneOf([true])
  })

  return (
    <Block
      marginTop={sizes.m}
      gradient={['#2196f3', '#3f51b5', '#673ab7']}
      start={[0.1, 0]}
      end={[1, 1]}
    >

      {/* button goback */}
      <Block flex={0}>
        <Button
          row
          flex={0}
          justify="flex-start"
          padding={sizes.sm}
          paddingBottom={0}
          onPress={() => navigation.goBack()}
        >
          <Image
            radius={0}
            width={10}
            height={18}
            color={colors.white}
            source={assets.arrow}
            transform={[{ rotate: '180deg' }]}
          />
          <Text h5 white marginLeft={sizes.sm}>
            {t('common.goBack')}
          </Text>
        </Button>
        <Text h4 center white marginBottom={sizes.s}>
          {t('signup.title')}
        </Text>
      </Block>

      {/* register and login form */}
      <Block
        keyboard
        behavior={'height'}
        height={sizes.height * 0.9}
        // marginTop={-(sizes.height * 0.75)}
        radius={sizes.sm}
        marginHorizontal="8%"
        marginBottom={15}
      >
        <Block
          blur
          flex={0}
          intensity={90}
          radius={sizes.sm}
          // overflow="hidden"
          justify="space-evenly"
          tint={colors.blurTint}
          paddingVertical={sizes.sm}
        >

          {/* social buttons */}
          <Block flex={0} row center justify="space-evenly" marginVertical={sizes.m}>
            <Button outlined gray shadow={!isAndroid} style={{ height: 60, width: 60 }}>
              <Image
                source={assets.facebook}
                height={sizes.md}
                width={sizes.md}
                color={isDark ? colors.grey300 : undefined}
              />
            </Button>
            {/* <Button outlined gray shadow={!isAndroid}>
                <Image
                  source={assets.apple}
                  height={sizes.m}
                  width={sizes.m}
                  color={isDark ? colors.grey300 : undefined}
                />
              </Button> */}
            <Button outlined gray shadow={!isAndroid} style={{ height: 60, width: 60 }}>
              <Image
                source={assets.google}
                height={sizes.md}
                width={sizes.md}
                color={isDark ? colors.grey300 : undefined}
              />
            </Button>
          </Block>

          {/* divider */}
          <Block
            row
            flex={0}
            align="center"
            justify="center"
            marginBottom={sizes.sm}
            paddingHorizontal={sizes.xxl}
          >
            <Block
              flex={0}
              height={1}
              width="50%"
              end={[1, 0]}
              start={[0, 1]}
              gradient={gradients.divider}
            />
            <Text center marginHorizontal={sizes.s}>
              {t('common.or')}
            </Text>
            <Block
              flex={0}
              height={1}
              width="50%"
              end={[0, 1]}
              start={[1, 0]}
              gradient={gradients.divider}
            />
          </Block>

          {/* form inputs */}
          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
              checked: false,
              submit: null
            }}
            validationSchema={SignInSchema}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
              try {
                console.log("formlogin value: ", values)
                setStatus({ success: false });
                setSubmitting(false);
              } catch (err: any) {
                setStatus({ success: false });
                setErrors({ submit: err.message });
                setSubmitting(false);
              }
            }}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
              <>
                <Block paddingHorizontal={sizes.sm}>
                  <Input
                    autoCapitalize="none"
                    marginBottom={sizes.m}
                    cursorColor="black"
                    label={t('common.name')}
                    placeholder={t('common.namePlaceholder')}
                    success={Boolean(touched.name && !errors.name)}
                    error={Boolean(touched.name && errors.name)}
                  />
                  <Input
                    autoCapitalize="none"
                    marginBottom={sizes.m}
                    cursorColor="black"
                    inputMode="email"
                    label={t('common.email')}
                    keyboardType="email-address"
                    placeholder={t('common.emailPlaceholder')}
                    onChangeText={handleChange('email')}
                    value={values.email}
                    onBlur={handleBlur('email')}
                    formhelperslabel={errors.email}
                    success={Boolean(touched.email && !errors.email)}
                    error={Boolean(touched.email && errors.email)}
                  />
                  <Input
                    modeSecureText
                    autoCapitalize="none"
                    marginBottom={sizes.md}
                    cursorColor="black"
                    label={t('common.password')}
                    placeholder={t('common.passwordPlaceholder')}
                    onChangeText={handleChange('password')}
                    value={values.password}
                    onBlur={handleBlur('password')}
                    formhelperslabel={errors.password}
                    success={Boolean(touched.password && !errors.password)}
                    error={Boolean(touched.password && errors.password)}
                  />
                  <Input
                    modeSecureText
                    autoCapitalize="none"
                    marginBottom={sizes.md}
                    cursorColor="black"
                    label={t('common.c_password')}
                    placeholder={t('common.c_passwordPlaceholder')}
                    onChangeText={handleChange('password')}
                    value={values.password}
                    onBlur={handleBlur('password')}
                    formhelperslabel={errors.password}
                    success={Boolean(touched.password && !errors.password)}
                    error={Boolean(touched.password && errors.password)}
                  />
                </Block>

                {/* checkbox terms */}
                <Block row flex={1} align="center" paddingHorizontal={sizes.sm}>
                  <Checkbox
                    marginRight={sizes.sm}
                    checked={values.checked}
                    onPress={() => handleChange('checked')}
                  />
                  <Text paddingRight={sizes.s}>
                    {t('common.agree')}
                    <Text
                      semibold
                    // onPress={() => navigation.navigate('')}
                    >
                      {t('common.terms')}
                    </Text>
                  </Text>
                </Block>

                {/* submit signin */}
                <Button
                  onPress={() => { handleSubmit(), handleChange('submit') }}
                  marginVertical={sizes.s}
                  marginHorizontal={sizes.sm}
                  gradient={gradients.primary}
                  disabled={
                    Boolean(
                      values.email === ''
                      || errors.email
                      || errors.password
                      || isSubmitting
                    )
                  }
                >
                  <Text bold white transform="uppercase">
                    {t('common.signup')}
                  </Text>
                </Button>
              </>
            )}
          </Formik>

          {/* has already account */}
          <Block row justify='center'>
            <Text marginRight={12} black transform="uppercase">
              {t('signup.alreadyaccount')}
            </Text>
            <Text bold primary transform="uppercase">
              {t('signin.title')}
            </Text>
          </Block>
        </Block>
      </Block>
    </Block >
  );
};

export default Signup;
