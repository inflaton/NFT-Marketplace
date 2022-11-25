import { Dialog, Form, Input, Select, Button, message } from 'tdesign-react';
import Text from '../typography';
import styles from './index.less';
import { useCallback, useMemo, useState } from 'react';
import type { OrderListResponse } from '@reddio.com/js';
import { reddio } from '@/utils/config';
import { ERC721Address } from '@/utils/common';
import { useQueryClient } from '@tanstack/react-query';
import { useSnapshot } from 'valtio';
import { store } from '@/utils/store';

const FormItem = Form.FormItem;

interface IOperateProps {
    onClose: () => void;
    nftToBuy: {
        order: OrderListResponse,
        card: any
    }
}

const Buy = (props: IOperateProps) => {
    const { onClose, nftToBuy } = props;
    const snap = useSnapshot(store);
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    const [form] = Form.useForm();
    const [selectedCard, setSelectedCard] = useState<any>(
        nftToBuy.cards[0]
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
        return nftToBuy.cards.map((item: any) => ({
            label: item.title,
            value: item.tokenId,
        }));
    }, [nftToBuy, selectedCard]);

    const submit = useCallback(async () => {
        const error = await form.validate?.();
        if (error && Object.keys(error).length) return;
        setLoading(true);

        const keypair = await reddio.keypair.generateFromEthSignature();
        const params = await reddio.utils.getOrderParams({
            keypair,
            amount: nftToBuy.order.amount,
            tokenAddress: nftToBuy.order.symbol.quote_token_contract_addr,
            tokenId: nftToBuy.order.token_id,
            orderType: 'buy',
            tokenType: nftToBuy.order.token_type,
            price: nftToBuy.order.display_price,
            marketplaceUuid: '11ed793a-cc11-4e44-9738-97165c4e14a7',
        });
        await reddio.apis.order(params);

        queryClient.refetchQueries(['orderList']);
        message.success('Buy Success');
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
                    <Text type="bold">Buy NFT</Text>
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
                            setSelectedCard(changedValues.type as any);
                        }
                    }}
                >
                    <FormItem label="Token Id" name="tokenId" initialData={nftToBuy.order.token_id}>
                        <Input type="number" readonly disabled />
                    </FormItem>
                    <FormItem label="ETH Price" name="price" initialData={nftToBuy.order.display_price}>
                        <Input type="number" readonly disabled />
                    </FormItem>
                    <FormItem label="Pay with Mastercard" name="type" initialData={nftToBuy.cards[0].tokenId}>
                        <Select clearable options={options} />
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
                            Buy
                        </Button>
                    </div>
                </Form>
            </div>
        </Dialog>
    );
};

export default Buy;
