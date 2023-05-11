import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import type { NextPage, GetServerSideProps } from 'next';
import FilePondPluginFileMetadata from 'filepond-plugin-file-metadata';
import Head from 'next/head';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import { useTranslation } from 'next-i18next';
import { FilePondFile } from 'filepond';

import { Modal, ModalContents, ModalOpenButton } from 'components/ModalWindow';
import { GSSPBasic } from 'utils/gsspBasic';
import NavMain from 'components/Navbars/NavMain';
import InputNoRegister from 'components/InputNoRegister';
import Icon from 'components/Icon';
import UpdateFolderName from '../components/Modals/UpdateFolderName';
import useStore from '../modules/Store';
import { getVault } from '../api/vault/getVault';
import { getFolders } from '../api/vault/getFolders';
import { deleteVault } from '../api/vault/deleteVault';
import { VaultFile } from 'models/vault/vault';
import UploadedFileSmaller from 'components/UploadedFileSmaller';
import { deleteFolder } from 'api/vault/deleteFolder';
import ProfileViewCard from 'components/ProfileViewCard';
import { REST_API_URL } from '../modules/config';
import FooterMain from 'components/FooterMain';
import { throwError } from 'utils/error';
import useTokensOrCookies from 'contexts/TokensOrCookies';

// Register the plugins
registerPlugin(FilePondPluginFileMetadata);

export const getServerSideProps: GetServerSideProps = GSSPBasic();

const Vault: NextPage = () => {
  const userUUID = useStore((state) => state.userUUID);
  const { t } = useTranslation();
  const { accessToken, companyRepresented } = useTokensOrCookies();
  const actingAsNewUser = useStore((state) => state.actingAsNewUser);
  const [section, setSection] = useState<string>('All Files');
  const [refresh, setRefresh] = useState<boolean>(true);

  const [vaultData, setVaultData] = useState<VaultFile[]>();

  const [file, setFile] = useState<any>([]);

  const [folderName, setFolderName] = useState<string>('');
  const [uploadFileError, setUploadFileError] = useState<string>('');

  const handleChangeFolder = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(e.target.value);
  };

  const refreshVault = () => {
    setRefresh(true);
  };

  const filteredVaultData = React.useMemo(
    () =>
      section === 'All Files'
        ? vaultData
        : vaultData?.filter((data: VaultFile) => {
            return data.folder.toLowerCase().includes(section.toLowerCase());
          }),
    [section, vaultData]
  );

  useEffect(() => {
    if ((refresh || actingAsNewUser) && userUUID) {
      const params = {
        params: {
          user_uuid: companyRepresented ? companyRepresented : userUUID,
        },
      };

      getVault(params)
        .then((res) => {
          setVaultData(res);
          setRefresh(false);
          useStore.setState({ actingAsNewUser: false });
        })
        .catch((err: any) => throwError(err));
    }
  }, [refresh, userUUID, companyRepresented, actingAsNewUser]);

  const [foldersData, setFoldersData] = useState<string[]>([]);

  useEffect(() => {
    if ((refresh || actingAsNewUser) && userUUID) {
      const params = {
        params: {
          user_uuid: companyRepresented ? companyRepresented : userUUID,
        },
      };
      getFolders(params)
        .then((res) => {
          setFoldersData(res.folders);
          setRefresh(false);
        })
        .catch((err: any) => throwError(err));
    }
  }, [accessToken, refresh, userUUID, companyRepresented, actingAsNewUser]);

  const DeleteFolder = (folder: string) => {
    const config = {
      data: {
        folder,
        user_uuid: companyRepresented ? companyRepresented : userUUID,
      },
    };

    deleteFolder(config)
      .then(() => {
        setRefresh(true);
        setSection('All Files');
      })
      .catch((err: any) => throwError(err));
  };

  const adjustSection = (newSection: string) => {
    return setSection(newSection);
  };

  const handlePondFile = (error: any, filePondFile: FilePondFile) => {
    if (error) {
      throwError(error);
      return;
    }
    // File added successfully
    setUploadFileError('');
    refreshVault();
    if (folderName && section === 'Create Folder') {
      setFile([]);
      setSection(folderName);
      setFolderName('');
      setUploadFileError('');
    }
  };
  const [search, setSearch] = useState<string>('');
  const [filteredFiles, setFilteredFiles] = useState<VaultFile[]>([]);

  useEffect(() => {
    if (!!search && filteredVaultData && filteredVaultData.length > 0) {
      setFilteredFiles(
        filteredVaultData.filter((item: VaultFile) => {
          return (
            item.filename_original.toLowerCase().indexOf(search.toLowerCase()) >
            -1
          );
        })
      );
    } else if (filteredVaultData) {
      setFilteredFiles(filteredVaultData);
    }
  }, [file, search, filteredVaultData]);

  const DeleteFile = (uri: string) => {
    const data = {
      data: {
        uris: [uri],
        user_uuid: companyRepresented ? companyRepresented : userUUID,
      },
    };

    deleteVault(data)
      .then((res) => {
        setRefresh(true);
      })
      .catch((err: any) => throwError(err));
  };

  return (
    <>
      <Head>
        <title>BIP Vault</title>
      </Head>
      <div className="fixed bottom-[-200px] right-0 overflow-hidden pointer-events-none">
        <Image
          src="/images/BackgroundBlur.svg"
          alt="background-blur"
          width={1353}
          height={524}
          objectPosition="right bottom"
          layout="fixed"
        />
      </div>
      <NavMain />
      <div className="relative grid max-w-full min-h-screen grid-cols-1 mx-5 lg:container lg:mx-auto md:grid-cols-10 2xl:px-8">
        <div className="pt-10 pb-5 md:pb-20 md:border-r-2 md:col-span-3 border-horizontalDivider lg:pt-16">
          <div className="text-3xl font-extrabold font-custom1 lg:text-4xl text-primary mb-7">
            {t('header.vault')}
          </div>
          <div className="flex flex-wrap md:flex-col">
            <ProfileViewCard
              image="FolderPurple.svg"
              title={t('vault.quarterly-reports')}
              isActive={section === 'Quarterly Reports'}
              onClick={() => {
                setSection('Quarterly Reports');
                setSearch('');
                setFile([]);
              }}
              type="Vault"
            />
            <ProfileViewCard
              image="FolderBlue2.svg"
              title={t('vault.financial-statements')}
              isActive={section === 'Financial Statements'}
              onClick={() => {
                setSection('Financial Statements');
                setSearch('');
                setFile([]);
              }}
              type="Vault"
            />
            <ProfileViewCard
              image="FolderOrange.svg"
              title={t('vault.deal-memos')}
              isActive={section === 'Deal Memos'}
              onClick={() => {
                setSection('Deal Memos');
                setSearch('');
                setFile([]);
              }}
              type="Vault"
            />
            <ProfileViewCard
              image="FolderGreen.svg"
              title={t('vault.all-other-contracts')}
              isActive={section === 'All Contracts'}
              onClick={() => {
                setSection('All Contracts');
                setSearch('');
                setFile([]);
              }}
              type="Vault"
            />
            <ProfileViewCard
              image="FolderPink.svg"
              title={t('vault.all-files')}
              isActive={section === 'All Files'}
              onClick={() => {
                setSection('All Files');
                setSearch('');
                setFile([]);
              }}
              type="Vault"
            />
          </div>
          <div className="flex items-center">
            <div className="mt-10 mb-2 font-bold font-custom1 textxl lg:text-2xl text-primary sm:mb-7">
              {t('new-folder')}
            </div>

            <div className="flex items-center justify-center w-12 h-12 mt-4 ml-2 bg-white rounded-lg hover:bg-button">
              <div className="relative inline-block w-full h-full group ">
                <Icon
                  name="Plus"
                  className="h-full mx-auto my-auto cursor-pointer fill-primary hover:fill-white top-10 right-4 sm:left-4 sm:right-auto "
                  viewBox="0 0 20 20"
                  size="18"
                />
                <div className="absolute z-20 hidden w-48 text-base rounded-lg shadow-lg font-custom1 text-primary group-hover:block group-hover:bg-white">
                  <div
                    className="flex w-full px-8 py-3 rounded-b-lg cursor-pointer hover:bg-backgroundInput"
                    onClick={() => {
                      setSection('Create Folder');
                      setSearch('');
                      setFilteredFiles([]);
                    }}
                  >
                    {t('vault.create-folder')}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <br />
          {foldersData.map((fold) => {
            return (
              fold !== 'Quarterly Reports' &&
              fold !== 'Financial Statements' &&
              fold !== 'Deal Memos' &&
              fold !== 'All Files' &&
              fold !== 'All Contracts' && (
                <ProfileViewCard
                  image="FolderBlue.svg"
                  key={fold}
                  title={fold}
                  isActive={section === fold}
                  onClick={() => setSection(fold)}
                  type="Vault"
                />
              )
            );
          })}
        </div>
        <div className="md:pt-10 md:ml-10 md:col-span-7 lg:pt-16">
          <div className="flex flex-wrap items-center justify-between w-full">
            <div className="flex items-center w-full mb-6 text-xl font-custom1 lg:text-3xl text-primary">
              <div className="flex flex-wrap justify-between w-full space-between">
                <div className="flex items-center">
                  <div className="mr-2 font-bold">{section}</div>
                  {section !== 'Quarterly Reports' &&
                    section !== 'Financial Statements' &&
                    section !== 'Deal Memos' &&
                    section !== 'All Files' &&
                    section !== 'Create Folder' &&
                    section !== 'All Contracts' && (
                      <div className="flex items-center justify-center ml-4">
                        <div className="relative inline-block group">
                          <Icon
                            name="ThreeDots"
                            className="cursor-pointer fill-inputGray hover:fill-primary"
                            viewBox="0 0 20 4"
                            size="18"
                          />
                          <div className="absolute z-30 hidden text-base rounded-lg shadow-lg w-60 font-custom1 text-primary group-hover:block group-hover:bg-white">
                            <Modal>
                              <ModalOpenButton>
                                <div className="flex w-full px-8 py-3 rounded-b-lg cursor-pointer hover:bg-backgroundInput">
                                  Change Folder Name
                                </div>
                              </ModalOpenButton>
                              <ModalContents pencil>
                                <UpdateFolderName
                                  refreshVault={refreshVault}
                                  defaultValue={section}
                                  adjustSection={adjustSection}
                                />
                              </ModalContents>
                            </Modal>
                            <div
                              className="flex w-full px-8 py-3 rounded-b-lg cursor-pointer hover:bg-backgroundInput"
                              onClick={() => DeleteFolder(section)}
                            >
                              {t('vault.delete-folder')}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
                {section !== 'Create Folder' && (
                  <div className="flex items-center px-2 pb-2 mt-5 border-b-2 border-borderColor sm:mt-0 focus-within:border-button">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.8981 14.9588C14.191 15.2517 14.6659 15.2517 14.9588 14.9588C15.2517 14.6659 15.2517 14.191 14.9588 13.8981L13.8981 14.9588ZM11.8516 10.791C11.5587 10.4981 11.0839 10.4981 10.791 10.791C10.4981 11.0839 10.4981 11.5587 10.791 11.8516L11.8516 10.791ZM12.2499 7.28558C12.2499 10.0273 10.0273 12.2499 7.28558 12.2499V13.7499C10.8557 13.7499 13.7499 10.8557 13.7499 7.28558H12.2499ZM7.28558 12.2499C4.54388 12.2499 2.32129 10.0273 2.32129 7.28558H0.821289C0.821289 10.8557 3.71545 13.7499 7.28558 13.7499V12.2499ZM2.32129 7.28558C2.32129 4.54388 4.54388 2.32129 7.28558 2.32129V0.821289C3.71545 0.821289 0.821289 3.71545 0.821289 7.28558H2.32129ZM7.28558 2.32129C10.0273 2.32129 12.2499 4.54388 12.2499 7.28558H13.7499C13.7499 3.71545 10.8557 0.821289 7.28558 0.821289V2.32129ZM14.9588 13.8981L11.8516 10.791L10.791 11.8516L13.8981 14.9588L14.9588 13.8981Z"
                        fill="#7C8B9E"
                        fillOpacity="0.6"
                      />
                    </svg>

                    <input
                      type="text"
                      name="search"
                      placeholder={t('search')}
                      className={
                        'pl-4 block w-56 appearance-none focus:outline-none bg-transparent placeholder-lightGray cursor-pointer text-sm md:text-base lg:text-lg font-custom1'
                      }
                      onChange={(e: any) => {
                        setSearch(e.target.value);
                      }}
                      value={search}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            {section === 'Create Folder' && (
              <div className="flex flex-col mt-10">
                <InputNoRegister
                  name="folder_new_name"
                  label="vault.update-folder-name"
                  placeholder={t('vault.enter-folder-name')}
                  type="text"
                  value={folderName}
                  onChange={handleChangeFolder}
                  smaller
                />
                <div
                  className="flex flex-wrap items-center max-w-2xl px-4 py-3 mx-5 mt-20 mb-10 text-sm font-bold text-white bg-blue-400 rounded-lg lg:mx-auto font-custom2"
                  role="alert"
                >
                  <svg
                    className="w-4 h-4 mr-2 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" />
                  </svg>
                  <p>{t('vault.upload-one-file-message')}</p>
                </div>
              </div>
            )}
          </div>
          {filteredVaultData?.length === 0 ? (
            section !== 'All Files' ? (
              <div className="mt-10 mb-20 text-lg font-normal text-center text-inputGray font-custom1">
                {t('vault.upload-your-files')}...
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center mt-10 text-lg text-center lg:mt-20 font-custom1 text-inputGray">
                <Image
                  src={'/images/Vault/UploadFile.png'}
                  alt="No products yet"
                  height={150}
                  width={150}
                  objectFit="contain"
                />
                <div className="mt-10">
                  {t('vault.start-uploading-files-by-selecting-a-folder')}
                </div>
              </div>
            )
          ) : (
            <div className="flex flex-wrap">
              {filteredFiles.map((item: VaultFile) => {
                return (
                  <UploadedFileSmaller
                    image={item.uri}
                    title={item.filename_original}
                    uri={item.uri}
                    deleteCapable={true}
                    key={item.uri}
                    deleteFile={DeleteFile}
                  />
                );
              })}
            </div>
          )}
          {/* IF CREATE FOLDER USE THAT FOLDER NAME */}
          {section !== 'All Files' &&
            (section !== 'Create Folder' || !!folderName) &&
            !!userUUID && (
              <>
                {uploadFileError && (
                  <div className="text-sm text-red-400 font-custom2">
                    {uploadFileError}
                  </div>
                )}
                <div className="flex flex-col px-10 py-10 my-10 border-2 rounded-lg shadow-lg hover:shadow-inner hover:shadow-button/50 lg:px-20 lg:py-20 border-backgroundInput">
                  <FilePond
                    allowFileMetadata={true}
                    files={file && file}
                    dropOnPage={true}
                    fileMetadataObject={{
                      folder:
                        section === 'Create Folder' ? folderName : section,
                      user_uuid: companyRepresented
                        ? companyRepresented
                        : userUUID,
                    }}
                    // labelFileProcessingError={(error: any) => {
                    //   console.log('serverResponse.message', error);
                    // }}
                    onupdatefiles={setFile}
                    instantUpload={true}
                    allowMultiple={true}
                    maxFiles={100}
                    acceptedFileTypes={['application/*']}
                    onprocessfile={handlePondFile}
                    server={{
                      // url: `${REST_API_URL}vault`,
                      headers: {
                        Authorization: `Bearer ${accessToken}`,
                      },
                      process: {
                        url: `${REST_API_URL}vault`,
                        onerror: (response: any) => {
                          setUploadFileError(JSON.parse(response).message);
                        },
                      },
                    }}
                    name="file"
                    labelIdle={`Drag & Drop your file or <span class="filepond--label-action">Browse</span> to add to folder<br/>
        <span class="upload-file-icon">
        <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg" class="upload-file-icon">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M30.4526 19.885V19.63C30.4526 15.975 27.5677 13 23.9409 13C21.2208 13 18.9953 14.7 18.0062 17.08C17.5117 16.825 17.0171 16.74 16.4401 16.74C14.2146 16.74 12.4837 18.525 12.4837 20.82V21.245C11.577 22.095 11 23.37 11 24.815C11 27.705 13.2255 30 16.028 30H28.9689C31.7714 30 33.9969 27.705 33.9969 24.815C34.0793 22.52 32.5132 20.48 30.4526 19.885ZM25.1773 23.88L23.0342 26.005L22.9518 26.09C22.8694 26.175 22.7045 26.175 22.6221 26.175H22.5397C22.3748 26.175 22.21 26.09 22.0451 25.92L19.902 23.795C19.5723 23.455 19.5723 23.03 19.902 22.69C20.2317 22.35 20.6439 22.35 20.9736 22.69L21.8802 23.625V19.545C21.8802 19.12 22.21 18.78 22.6221 18.78C23.0342 18.78 23.3639 19.12 23.3639 19.545V23.625L24.2706 22.775C24.6003 22.435 25.0124 22.435 25.3421 22.775C25.6719 23.115 25.507 23.625 25.1773 23.88Z" fill="url(#paint0_linear_2283_26061)"/>
        <defs>
        <linearGradient id="paint0_linear_2283_26061" x1="21.9241" y1="18.0947" x2="12.3702" y2="34.5897" gradientUnits="userSpaceOnUse">
        <stop stop-color="#79C9E7"/>
        <stop offset="1" stop-color="#887EF1"/>
        </linearGradient>
        </defs>
        </svg>        
        </span>
        `}
                    credits={false}
                  />
                </div>
              </>
            )}
        </div>
      </div>
      <FooterMain />
    </>
  );
};

export default Vault;
