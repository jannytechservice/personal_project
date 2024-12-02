import { gql, useMutation, useQuery } from '@apollo/client';
import { WBLanguageSelect } from '@admiin-com/ds-web';
import { Language, LANGUAGES } from '@admiin-com/ds-common';
import { updateUserAttributes } from 'aws-amplify/auth';
import { useTranslation } from 'react-i18next';
import { CSGetSub as GET_SUB } from '@admiin-com/ds-graphql';
import { updateUser as UPDATE_USER } from '@admiin-com/ds-graphql';

export const ChangeLanguage = () => {
  const { i18n, t } = useTranslation();
  const { data: subData } = useQuery(gql(GET_SUB));
  const [updateUser] = useMutation(gql(UPDATE_USER));

  const changeLanguage = async (lng: Language) => {
    await i18n.changeLanguage(lng.value);
    try {
      await updateUser({
        variables: {
          input: {
            id: subData?.sub,
            locale: lng.value,
          },
        },
      });
    } catch (err) {
      console.log('ERROR update user locale: ', err);
    }

    try {
      await updateUserAttributes({
        userAttributes: { locale: lng?.value },
      });
    } catch (err) {
      console.log('ERROR update user attribute locale: ', err);
    }
  };

  return (
    <WBLanguageSelect
      languages={LANGUAGES}
      language={i18n.resolvedLanguage}
      onLanguageChange={changeLanguage}
      title={t('selectLanguageTitle', { ns: 'common' })}
    />
  );
};
