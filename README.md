## 오늘 과제는 resolver들에 역할 (Host, Listener) 기반 권한 부여(authorization)를 구현할 차례입니다.

## 지금 만드는 Podcast discovery app에서 유저들은 Host와 Listener 두 가지의 중 하나의 역할을 가지고 있습니다.

## 따라서 메타데이터를 설정, Guard와 Decorator을 만들어 resolver를 호출할 때 사용자의 역할을 검증하는 코드를 만드시면 됩니다.

## RoleType이 'Any', 'Host', 'Listener'인 @Role(RoleType) 형태로 decorator를 만들어서 사용자의 role에 따라 resolver를 보호하게 만드세요.

## 예를 들어, 'Host'가 역할인 유저만이 팟캐스트를 생성할 수 있습니다.
