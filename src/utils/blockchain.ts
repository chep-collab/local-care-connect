import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { mainnet } from 'viem/chains';
import { Credential } from '@/types';

export class CredentialVerifier {
  private publicClient;
  private walletClient;

  constructor() {
    this.publicClient = createPublicClient({
      chain: mainnet,
      transport: http()
    });

    // Initialize wallet client when user connects their wallet
    if (typeof window !== 'undefined' && window.ethereum) {
      this.walletClient = createWalletClient({
        chain: mainnet,
        transport: custom(window.ethereum)
      });
    }
  }

  async verifyCredential(credential: Credential): Promise<boolean> {
    try {
      // Get the credential hash from the blockchain
      const storedHash = await this.getCredentialHash(credential.verificationHash);
      
      // Generate hash of current credential data
      const currentHash = this.generateCredentialHash(credential);
      
      // Compare hashes
      return storedHash === currentHash;
    } catch (error) {
      console.error('Error verifying credential:', error);
      return false;
    }
  }

  async storeCredential(credential: Credential): Promise<string> {
    try {
      if (!this.walletClient) {
        throw new Error('Wallet not connected');
      }

      const hash = this.generateCredentialHash(credential);
      
      // Store hash on blockchain (simplified example)
      // In reality, you'd use a smart contract for this
      const transaction = await this.walletClient.sendTransaction({
        to: '0x...', // Smart contract address
        data: hash,
      });

      return transaction;
    } catch (error) {
      console.error('Error storing credential:', error);
      throw error;
    }
  }

  private async getCredentialHash(verificationHash: string): Promise<string> {
    // In reality, this would call a smart contract to get the stored hash
    // This is a simplified example
    return await this.publicClient.getStorageAt({
      address: '0x...', // Smart contract address
      slot: verificationHash
    });
  }

  private generateCredentialHash(credential: Credential): string {
    // Create a string of the important credential data
    const credentialString = `
      ${credential.type}
      ${credential.issuer}
      ${credential.dateIssued.toISOString()}
      ${credential.expiryDate.toISOString()}
    `;

    // In reality, you'd use a proper hashing function
    // This is just for demonstration
    return Buffer.from(credentialString).toString('hex');
  }

  async isCredentialValid(credential: Credential): Promise<boolean> {
    // Check if credential is expired
    const now = new Date();
    if (now > credential.expiryDate) {
      return false;
    }

    // Verify the credential on blockchain
    const isVerified = await this.verifyCredential(credential);
    if (!isVerified) {
      return false;
    }

    // Check if credential is revoked
    return credential.status !== 'revoked';
  }
}
