import { Dialog, Form, Input, Select, Button, message } from 'tdesign-react';
import Text from '../typography';
import styles from './index.less';
import { useCallback, useMemo, useState } from 'react';
import type { BalanceResponse } from '@reddio.com/js';
import { reddio } from '@/utils/config';
import { ERC721Address } from '@/utils/common';
import { useQueryClient } from '@tanstack/react-query';
import { useSnapshot } from 'valtio';
import { store } from '@/utils/store';
import axios from 'axios';

const FormItem = Form.FormItem;

interface IOperateProps {
  onClose: () => void;
  balance: {
    ERC721: BalanceResponse[];
    ERC721M: BalanceResponse[];
  };
}

const Mint = (props: IOperateProps) => {
  const { onClose, balance } = props;
  const snap = useSnapshot(store);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [selectedType, setSelectedType] = useState<'ERC721' | 'ERC721M'>(
    'ERC721M',
  );

  const rules = useMemo<any>(() => {
    return {
      price: [{ required: true, message: 'Price is required', type: 'error' }],
      tokenId: [
        {
          required: true,
          message: 'Token ID is required',
          type: 'error',
        },
      ],
    };
  }, []);

  const options = useMemo(() => {
    return balance[selectedType].map((item: any) => ({
      label: item.token_id,
      value: item.token_id,
    }));
  }, [balance, selectedType]);

  const submit = useCallback(async () => {
    const error = await form.validate?.();
    if (error && Object.keys(error).length) return;
    setLoading(true);
    const type = form.getFieldValue?.('type');
    const keypair = await reddio.keypair.generateFromEthSignature();
    const contract_address = type === 'ERC721' ? ERC721Address : snap.erc721MAddress;

    const result = await axios.post('https://api-dev.reddio.com/v1/mints', {
      contract_address,
      stark_key: keypair.publicKey,
      amount: "1"
    },
      {
        headers: {
          'X-API-Key': 'rk-d3294774-a408-4f32-8f70-ebca18f9960f'
        },
      });

    console.log(result.data);

    setLoading(false);
    queryClient.refetchQueries(['orderList']);
    message.success('Mint Success');
    onClose();
  }, []);

  return (
    <Dialog
      closeBtn
      closeOnOverlayClick
      destroyOnClose={false}
      draggable={false}
      footer={false}
      header={false}
      mode="modal"
      onClose={onClose}
      placement="top"
      preventScrollThrough
      showInAttachedElement={false}
      showOverlay
      theme="default"
      visible
    >
      <div className={styles.operateDialogContent}>
        <div>
          <Text type="bold">Mint NFT</Text>
        </div>
        <Form
          form={form}
          colon={false}
          requiredMark
          labelAlign="top"
          layout="vertical"
          preventSubmitDefault
          showErrorMessage
          rules={rules}
          onValuesChange={(changedValues) => {
            if (changedValues.type) {
              form.reset?.({ fields: ['tokenId'] });
              setSelectedType(changedValues.type as any);
            }
          }}
        >
          <FormItem label="Asset Type" name="type" initialData="ERC721M">
            <Select
              clearable
              options={[
                // { label: 'ERC721', value: 'ERC721' },
                { label: 'ERC721M', value: 'ERC721M' },
              ]}
            />
          </FormItem>
          <div className={styles.buttonWrapper}>
            <Button
              theme="default"
              shape="round"
              size="large"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              shape="round"
              size="large"
              loading={loading}
              onClick={submit}
            >
              Mint
            </Button>
          </div>
        </Form>
      </div>
    </Dialog>
  );
};

export default Mint;
