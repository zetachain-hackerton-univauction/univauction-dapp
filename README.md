# univauction

**"Univection: Ideas as Assets"**

아이디어 자체를 온체인 자산으로 등록하고, 글로벌 누구나 옴니체인 경매를 통해 참여할 수 있는 플랫폼.


### 개요

아이디어 증명 (Proof Certificate): 아이디어 등록 시 내용/파일 해시를 ZetaChain에 기록하고, IdeaProofNFT(SBT) 발행 → 선점권과 진위 보장.

옴니체인 경매 (Omnichain Auction): ZetaChain Universal App 기반으로, 어떤 체인의 자산이든 즉시 스왑 후 입찰 가능.

아이디어 거래/유통: 경매를 통해 아이디어가 낙찰되면, 입찰자는 NFT 소유권을 통해 권리를 확보.

유저 친화적 UX: 지갑 연결 후, 단순 입찰/결제 플로우로 누구나 쉽게 참여.

### 기술

Blockchain: ZetaChain (Universal App, Gateways, ZRC-20)

Smart Contract: Solidity (Universal Contract, NFT/SBT 발행, Auction 로직)

Frontend: React + Vite (Figma 기반 구현)

Wallet: MetaMask (Cross-chain 입찰 지원)

Backend: Spring Boot + PostgreSQL (API, indexing)

Infra: Supabase (데이터 관리) + Render (배포/호스팅)
