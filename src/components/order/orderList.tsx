import { Button, Row, Col, message, Image, Space } from 'tdesign-react';
import { ShopIcon } from 'tdesign-icons-react';
import Text from '../typography';
import styles from './index.less';
import { useQuery } from '@tanstack/react-query';
import { reddio } from '@/utils/config';
import { ERC721MAddress } from '@/utils/common';
import { useCallback, useState } from 'react';
import type { OrderListResponse, BalanceResponse } from '@reddio.com/js';
import axios from 'axios';
import { useSnapshot } from 'valtio';
import { store } from '@/utils/store';
import BuyDialog from '../dialog/buy';
import SellDialog from '../dialog/sell';
import MintDialog from '../dialog/mint';
import { ethers } from 'ethers';

const OrderList = () => {
  const snap = useSnapshot(store);
  const [orderList, setOrderList] = useState<OrderListResponse[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [ethBalance, setEthBalance] = useState(0);
  const [nftBalance, setNftBalance] = useState<{
    ERC721: BalanceResponse[];
    ERC721M: BalanceResponse[];
  }>({ ERC721: [], ERC721M: [] });
  const [nftToBuy, setNftToBuy] = useState<{
    order: OrderListResponse,
    card: any
  }>({});
  const [showSellDialog, setShowSellDialog] = useState(false);
  const [showMintDialog, setShowMintDialog] = useState(false);
  const [showBuyDialog, setShowBuyDialog] = useState(false);

  const orderListQuery = useQuery(
    ['orderList'],
    () => {
      return reddio.apis.orderList({
        contractAddress: ERC721MAddress,
      });
    },
    {
      onSuccess: async ({ data }) => {
        const arr = data.data.list
          .filter((item) => item.token_id !== '')
          .filter((item) => item.symbol.base_token_name === 'ETH');
        arr.sort((a, b) => a.token_id - b.token_id);
        setOrderList(arr);

        // console.log(arr);
        const images = arr.map((item) => ({ image: `https://nft-marketplace-l2.netlify.app/images/${item.token_id}` }));
        // console.log(images);
        setImages(images);

        // const tokenIds = arr.map((item) => item.token_id).join(',');
        // const { data: urls } = await axios.get(
        //   `https://metadata.reddio.com/metadata?token_ids=${tokenIds}&contract_address=${ERC721MAddress}`,
        // );
        // console.log(urls.data);
        // setImages(urls.data);
      },
    },
  );

  useQuery(
    ['getBalances', snap.starkKey],
    () => {
      return reddio.apis.getBalances({
        starkKey: snap.starkKey,
      });
    },
    {
      onSuccess: ({ data }) => {
        if (data.error) return;
        if (data.data.list.length) {
          const ethBalance = data.data.list.find((item) => item.type === 'ETH');
          const erc721Balance = data.data.list.filter(
            (item) =>
              item.contract_address === ERC721MAddress.toLowerCase() &&
              item.balance_available,
          );
          const erc721MBalance = data.data.list.filter(
            (item) =>
              item.contract_address === snap.erc721MAddress.toLowerCase() &&
              item.balance_available,
          );
          ethBalance && setEthBalance(ethBalance.balance_available);
          setNftBalance({
            ERC721: erc721Balance,
            ERC721M: erc721MBalance,
          });
        }
      },
    },
  );

  const buy = useCallback(
    async (order: OrderListResponse) => {
      if (ethBalance < Number(order.price)) {
        message.error('Insufficient balance');
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      console.log(network);

      const chainId = network.chainId;

      const signer = provider.getSigner();
      const address = await signer.getAddress();
      console.log(address);

      const url = `${process.env.MCNFT_BASE_URL}/getNftCards/${chainId}/${address}`
      console.log(`getting cards from ${url}`)

      axios
        .get(url)
        .then((response) => {
          const cards = response.data
          if (!cards.length) {
            message.error('No Card NFT found! Please add a Mastercard card.');
            setTimeout(() => {
              const url = `${process.env.MCNFT_BASE_URL}/#/addCard?chainId=${chainId}&address=${address}`;
              window.open(url, '_blank');
            }, 3000);
          } else {
            const nftToBuy = { order, cards }
            console.log('nftToBuy', nftToBuy)
            setNftToBuy(nftToBuy);
            setShowBuyDialog(true);
          }
        })
        .catch(console.error)
    },
    [ethBalance],
  );

  return (
    <>
      <div className={styles.orderListWrapper}>
        <div>
          <Text type="bold">Order List</Text>
          <Button
            theme="primary"
            variant="text"
            disabled={!snap.starkKey}
            onClick={() => setShowMintDialog(true)}
          >
            Mint NFT
          </Button>
          <Button
            theme="primary"
            variant="text"
            disabled={!snap.starkKey}
            onClick={() => setShowSellDialog(true)}
          >
            Sell NFT
          </Button>
        </div>
        <Row gutter={[20, 24]}>
          {orderList.map((item, index) => {
            return (
              <Col flex="190px" className={styles.item} key={index}>
                <div>
                  <div style={{ width: 190, height: 190 }}>
                    {images.length ? (
                      <Image
                        src={images[index]?.image}
                        alt=""
                        style={{
                          width: '100%',
                          height: '100%',
                          background: 'none',
                        }}
                      />
                    ) : null}
                  </div>
                  <Button
                    icon={<ShopIcon />}
                    shape="round"
                    disabled={!snap.starkKey}
                    onClick={() => buy(item)}
                  >
                    Buy
                  </Button>
                </div>
                <Text>
                  {item.display_price} {item.symbol.base_token_name}
                </Text>
                <Space />
                <Text>Token Id: {item.token_id}</Text>
              </Col>
            );
          })}
        </Row>
      </div>
      {showMintDialog ? (
        <MintDialog
          balance={nftBalance}
          onClose={() => setShowMintDialog(false)}
        />
      ) : null}
      {showSellDialog ? (
        <SellDialog
          balance={nftBalance}
          onClose={() => setShowSellDialog(false)}
        />
      ) : null}
      {showBuyDialog ? (
        <BuyDialog
          nftToBuy={nftToBuy}
          onClose={() => setShowBuyDialog(false)}
        />
      ) : null}
    </>
  );
};

export default OrderList;
