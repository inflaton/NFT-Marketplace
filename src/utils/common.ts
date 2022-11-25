import { isVercel } from '@/utils/config';

const ERC20Address = !isVercel
  ? '0x57F3560B6793DcC2cb274c39E8b8EBa1dd18A086'
  : '0xB8c77482e45F1F44dE1745F52C74426C631bDD52';
const ERC721Address = !isVercel
  ? '0x941661bd1134dc7cc3d107bf006b8631f6e65ad5'
  : '0x316442f06d97fc9864ff32f84b9fcaecd71f049d';

const ERC721MAddress = '0x3fB44BFa72591Ff4be8bf048384b17c2fDAf9622';

export { ERC721MAddress, ERC721Address, ERC20Address };
