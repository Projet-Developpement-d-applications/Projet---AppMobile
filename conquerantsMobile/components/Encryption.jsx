import JSEncrypt from 'jsencrypt';
import { publicKey } from '../publicKey';

export function encrypt(data) {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  const encrypted = encrypt.encrypt(data);
  return encrypted;
}