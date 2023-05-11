import 'react-datepicker/dist/react-datepicker.css';
import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

import { GSSPBasic } from 'utils/gsspBasic';
import Button from 'components/Buttons/Button';
import { ItemsPermittedResponse } from 'models/item/item';
import { addItemPermitted } from 'api/item/addItemPermitted';
import { throwError } from 'utils/error';
import { getUsersCall } from 'api/user/getUsersCall';
import { UserByUuidResponse } from 'models/user/user';
import Paper from 'components/Paper';
import InputNoRegister from 'components/InputNoRegister';
import { getItemsPermitted } from 'api/item/getItemsPermitted';

export const getServerSideProps: GetServerSideProps = GSSPBasic();

const AuthorizeProperty: NextPage = () => {
  const [users, setUsers] = useState<UserByUuidResponse[]>([]);

  useEffect(() => {
    getUsersCall('licensor')
      .then((res: UserByUuidResponse[]) => {
        setUsers(res);
        // getUsersCall('agent').then((res2: UserByUuidResponse[]) => {
        // });
      })
      .catch((err: any) => throwError(err));
  }, []);

  const [refresh, setRefresh] = useState<boolean>(true);
  const [companyName, setCompanyName] = useState<string>('');
  const [brandName, setBrandName] = useState<string>('');
  const [itemsPermitted, setItemsPermitted] =
    useState<ItemsPermittedResponse[]>();

  const handleAddBrand = (e: any) => {
    setBrandName(e.target.value);
  };

  useEffect(() => {
    if (!!companyName) {
      const params = {
        params: {
          user_uuid: companyName,
        },
      };

      getItemsPermitted(params)
        .then((res) => {
          setItemsPermitted(res);
          setRefresh(false);
        })
        .catch((err) => throwError(err));
    }
  }, [companyName, refresh]);

  const submit = () => {
    const addItem = {
      name: brandName,
      item_type: 'Licensable Property',
      user_uuid: companyName,
    };

    addItemPermitted(addItem)
      .then(() => {
        alert('item added');
        setRefresh(true);
      })
      .catch((err) => throwError(err));
  };

  return (
    <div className="relative">
      <Head>
        <title>BIP Authorize Property</title>
      </Head>
      <div className="flex flex-col max-w-full min-h-screen pt-16 sm:mx-8 lg:container lg:mx-auto ">
        <div className="mb-4 text-xl font-bold text-primary font-custom1 md:text-xl lg:text-2xl">
          Authorize Property
        </div>
        {users && (
          <Paper>
            <div className="relative flex flex-col font-bold border-b-4 border-borderColor focus-within:border-button font-custom1">
              <label
                htmlFor="property_name"
                className="block mb-8 text-lg md:text-xl lg:text-2xl"
              >
                <span className="text-primary">Company </span>
                <span className="text-button">Name</span>
              </label>
              <div className="flex items-center justify-between">
                <select
                  id="property-name"
                  className="bg-backgroundInput border border-inputGray text-lg font-custom1 md:text-xl lg:text-2xl text-primary rounded-lg focus:ring-button focus:border-button block w-full p-2.5"
                  onChange={(event) => setCompanyName(event.target.value)}
                >
                  <option defaultValue={'Choose A Company'}>
                    Choose a company
                  </option>
                  {users.map((item: any, index: number) => {
                    return (
                      <option
                        value={item.uuid}
                        key={index}
                        className="text-primary"
                      >
                        {item.company_name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="my-10">
              <InputNoRegister
                name="brand_name"
                label="authorized-property.whats-your-brand-name"
                placeholder="Type brand name"
                type="text"
                value={brandName}
                onChange={handleAddBrand}
                smaller
              />
            </div>
            <div className="flex flex-col items-center justify-center mt-16">
              <Button onClick={submit}>Confirm & Send</Button>
            </div>
            {companyName && itemsPermitted && (
              <>
                <div className="mt-10 mb-2 text-lg font-bold font-custom1">
                  Items Permitted
                </div>
                <div className="w-full p-5 mb-20 rounded-lg bg-backgroundInput">
                  {itemsPermitted.map((item: ItemsPermittedResponse) => {
                    return (
                      <div key={item.uuid} className="mb-1">
                        {item.name}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </Paper>
        )}
      </div>
    </div>
  );
};

export default AuthorizeProperty;
