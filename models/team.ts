import { BlaseballTeam, ChroniclerEntity } from "./types"

type SpecialTeamProps = {
    emoji: string,
    fullName: string,
    id: string,
    mainColor: string,
    secondaryColor: string,
    shorthand: string,
    slogan: string
}

const groups = [
    {
        id: "gamma10",
        name: "Current Short Circuit",
        teams: [
            "4ac1b94f-a3f6-4650-ade9-1fd8ced20e18",
            "e09e5d91-dd07-4551-abb8-e527f59361a8",
            "af191af8-f0c1-4aac-9fb5-aed18f39a126",
            "51acdb7f-7cb9-44a0-8045-28c0d4b93c97",
            "2447e81d-aa1f-4085-a236-a332dc6cc852",
            "db2dee1e-9f7c-4b08-a30d-3d31286122df",
            "43a27ded-3229-49b5-9e44-2213d946588e",
            "47eab5f7-f0bc-4c8a-8064-adcae710c8e4",
            "2f90c5e3-21fe-4842-b89a-c00c14bc4d5a",
            "266c8526-9961-4679-883a-6f14b40b1fc3",
            "7e89ab0c-e63e-44e2-8c9d-689ad30cc5b3",
            "5ca18590-fa0e-4d48-ba83-499807627175",
            "fa3b11e7-5321-485f-bdbd-355af10cce11",
            "8300554b-15cc-467f-bfa5-28e02024d59f",
            "537cf346-533e-4f8d-92e6-54a43b285e18",
            "ffd22be8-35a9-4424-95ea-4287798fa9f9",
            "b9e5f7df-1455-44b0-a659-65fa96bee48e",
            "d5ba891d-5c45-4580-bbbc-9df0a98828e8",
            "232bce91-2309-428e-94e1-b8db04ac21dc",
            "c151c964-3d5c-41b6-8416-2a97f913742e",
            "4ad4b645-80eb-4375-80cd-6ab227c5894b",
            "5cd141a6-3885-47f1-9e76-3ac108e51578",
            "745ff28d-c557-4862-8f66-9775de881b67",
            "2036a676-afd7-4693-91e0-d1839f23089a",
        ],
    },
    {
        id: "beta",
        name: "Beta",
        teams: [
            "adc5b394-8f76-416d-9ce9-813706877b84",
            "8d87c468-699a-47a8-b40d-cfb73a5660ad",
            "b63be8c2-576a-4d6e-8daf-814f8bcea96f",
            "ca3f1c8c-c025-4d8e-8eef-5be6accbeb16",
            "3f8bbb15-61c0-4e3f-8e4a-907a5fb1565e",
            "979aee4a-6d80-4863-bf1c-ee1a78e06024",
            "105bc3ff-1320-4e37-8ef0-8d595cb95dd0",
            "d9f89a8a-c563-493e-9d64-78e4f9a55d4a",
            "a37f9158-7f82-46bc-908c-c9e2dda7c33b",
            "c73b705c-40ad-4633-a6ed-d357ee2e2bcf",
            "b72f3061-f573-40d7-832a-5ad475bd7909",
            "7966eb04-efcc-499b-8f03-d13916330531",
            "46358869-dce9-4a01-bfba-ac24fc56f57e",
            "36569151-a2fb-43c1-9df7-2df512424c82",
            "eb67ae5e-c4bf-46ca-bbbc-425cd34182ff",
            "23e4cbc1-e9cd-47fa-a35b-bfa06f726cb7",
            "bfd38797-8404-4b38-8b82-341da28b1f83",
            "9debc64f-74b7-4ae1-a4d6-fce0144b6ea5",
            "b024e975-1c4a-4575-8936-a3754a08806a",
            "f02aeae2-5e6a-4098-9842-02d2273f25c7",
            "878c1bf6-0d21-4659-bfee-916c8314d69c",
            "747b8e4a-7e50-4638-a973-ea7950a3e739",
            "57ec08cc-0411-4643-b304-0e80dbc15ac7",
            "bb4a9de5-c924-4923-a0cb-9d1445f1ee5d",
        ],
    },
    {
        id: "historical",
        name: "Historical",
        teams: [
            "88151292-6c12-4fb8-b2d6-3e64821293b3",
            "d6a352fc-b675-40a0-864d-f4fd50aaeea0",
            "54d0d0f2-16e0-42a0-9fff-79cfa7c4a157",
            "71c621eb-85dc-4bd7-a690-0c68c0e6fb90",
            "9494152b-99f6-4adb-9573-f9e084bc813f",
            "a4b23784-0132-4813-b300-f7449cb06493",
            "c19bb50b-9a22-4dd2-8200-bce639b1b239",
            "939db13f-79c9-41c5-9a15-b340b1bea875",
            "3a094991-4cbc-4786-b74c-688876d243f4",
            "55c9fee3-79c8-4467-8dfb-ff1e340aae8c",
            "b6b5df8f-5602-4883-b47d-07e77ed9d5af",
            "00245773-6f25-43b1-a863-42b4068888f0",
            "d0762a7e-004b-48a9-a832-a993982b305b",
            "1e04e5cc-80a6-41c0-af0d-7292817eed79",
            "3543229a-668c-4ac9-b64a-588422481f12",
            "74966fbd-5d77-48b1-8075-9bf197583775",
            "1a51664e-efec-45fa-b0ba-06d04c344628",
            "53d473fb-ffee-4fd3-aa1c-671228adc592",
            "774762ee-c234-4c57-90a1-e1e69db3f6a7",
            "cbd44c06-231a-4d1a-bb7d-4170b06e566a",
            "258f6389-aac1-43d2-b30a-4b4dde90d5eb",
            "4cd14d96-f817-41a3-af6c-2d3ed0dd20b7",
            "67c0a873-ef6d-4a85-8293-af638edf3c9f",
            "ed60c164-fd31-42ff-8ae1-70220626f5a7",
            "26f947db-4e2a-41a5-896c-02cf8eb47af0",
            "7bc12507-1a84-4921-9338-c1888d56dcd7",
            "8e50d878-3dcd-4c27-9f1c-8d8f20f17077",
            "cfd20759-5f9c-4596-9493-2669b6daf396",
            "4c192065-65d8-4010-8145-395f82d24ddf",
            "b47df036-3aa4-4b98-8e9e-fe1d3ff1894b",
            "2e22beba-8e36-42ba-a8bf-975683c52b5f",
        ],
    },
    {
        id: "coffee",
        name: "Coffee Cup",
        teams: [
            "70eab4ab-6cb1-41e7-ac8b-1050ee12eecc",
            "9e42c12a-7561-42a2-b2d0-7cf81a817a5e",
            "b3b9636a-f88a-47dc-a91d-86ecc79f9934",
            "4d921519-410b-41e2-882e-9726a4e54a6a",
            "e3f90fa1-0bbe-40df-88ce-578d0723a23b",
            "4e5d0063-73b4-440a-b2d1-214a7345cf16",
            "d8f82163-2e74-496b-8e4b-2ab35b2d3ff1",
            "e8f7ffee-ec53-4fe0-8e87-ea8ff1d0b4a9",
            "49181b72-7f1c-4f1c-929f-928d763ad7fb",
            "a3ea6358-ce03-4f23-85f9-deb38cb81b20",
            "a7592bd7-1d3c-4ffb-8b3a-0b1e4bc321fd",
            "9a5ab308-41f2-4889-a3c3-733b9aab806e",
            "f29d6e60-8fce-4ac6-8bc2-b5e3cabc5696",
            "3b0a289b-aebd-493c-bc11-96793e7216d5",
            "d2634113-b650-47b9-ad95-673f8e28e687",
            "7fcb63bc-11f2-40b9-b465-f1d458692a63",
        ],
    },
    {
        id: "gamma9",
        name: "Short Circuit 3",
        teams: [
            "a94de6ef-5fc9-4470-89a0-557072fe4daf",
            "6f9ff34d-825f-477b-8600-1cec4febaecf",
            "505ae98b-7d85-4f51-99ef-60ccd7365d97",
            "d2949bd0-6a28-4e0d-aa07-cecc437cbd99",
            "5371833b-a620-4952-b2cb-a15eed8ad183",
            "30c9bcd2-cc5a-421d-97d0-d39fefad053a",
            "f0ec8435-0427-4ffd-ad0c-a67f60a75e0e",
            "7dc37924-0bb8-4e40-a826-c497d51e447c",
            "36f4efea-9d27-4457-a7b4-4b45ad2e23a3",
            "93f91157-f628-4c9a-a392-d2b1dbd79ac5",
            "9a2f6bb9-c72c-437c-a3c4-e076dc5d10d4",
            "9da5c6b8-ccad-4bb5-b6b8-dc1d6b8ca6ed",
            "22d8a1e9-e679-4bde-ae8a-318cb591d1c8",
            "5818fb9b-f191-462e-9085-6fe311aaaf70",
            "3d858bda-dcef-4d05-928e-6557d3123f17",
            "8b38afb3-2e20-4e73-bb00-22bab14e3cda",
            "3a4412d6-5404-4801-bf06-81cb7884fae4",
            "fab9420f-0730-4054-bd17-355113f204c2",
            "19f81c84-9a94-49fa-9c23-2e1355126250",
            "ee722cbd-812f-4525-81d7-dfa89fb867a4",
            "0706f3cf-d6c4-4bd0-ac8c-de3d75ffa77e",
            "b1a50aa9-c515-46e8-8db9-d5378840362c",
            "045b4b38-fb11-4fa6-8dc0-f75997eacd28",
            "79347640-8d5d-4e41-819d-2b0c86f20b76",
        ],
    },
    {
        id: "gamma8",
        name: "Short Circuit 2",
        teams: [
            "75667373-b350-499b-b86e-5518b6f9f6ab",
            "57d3f614-f8d3-4dfd-b486-075f823fdb0b",
            "d82a1a80-dff3-4767-bab6-484b2eb7aee1",
            "6526d5df-6a9c-48e1-ba50-12dec0d8b22f",
            "a01f0ade-0186-464d-8c68-e19a29cb66f0",
            "2957236a-6077-4012-a445-8c5be111afd0",
            "86f4485a-a6db-470b-82f5-e95e6b353537",
            "b7df2ea6-f4e8-4e6b-8c98-f730701f3717",
            "b35926d4-22a3-4419-8fab-686c41687055",
            "b069fdc6-2204-423a-932c-09037adcd845",
            "89796ffb-843a-4163-8dec-1bef229c68cb",
            "8981c839-cbcf-47e3-a74e-8731dcff24fe",
            "16d1fd9b-c62b-4bed-b68a-b3a2d6e21524",
            "74aea6b6-34f9-48f4-b298-7345e1f9f7cb",
            "76d3489f-c7c4-4cb9-9c58-b1e1bab062d1",
            "effdbd8d-a54f-4049-a3c8-b5f944e5278b",
            "e11df0cc-3a95-4159-9a84-fecbbf23ae05",
            "93e71a0e-80fc-46b7-beaf-d204c425fe03",
            "8d7ba290-5f87-403c-81e3-cf5a2b6a6082",
            "b320131f-da0d-43e1-9b98-f936a0ee417a",
            "2dc7a1fa-3ae6-47ed-8c92-5d80167959f5",
            "44d9dc46-7e81-4e21-acff-c0f5dd399ae3",
            "0b672007-ebfb-476d-8fdb-fb66bad78df2",
            "23a2cea4-5df7-4ed0-bb2c-b8c297518ada",
        ],
    },
    {
        id: "gamma4",
        name: "Short Circuit 1",
        teams: [
            "29a5d00e-316f-4f35-b453-d893b6931c81",
            "19c73d98-224b-4080-96ab-090d85182e6f",
            "452c3aa0-278f-43d6-b966-d108236c5a38",
            "96e8673a-6d66-4dda-bfa5-c32e99151162",
            "603c9922-d2dd-4b42-af82-a4abe8f1ddba",
            "0d7a987a-1692-4066-8992-f6f406fa5be3",
            "87a7cbe0-dddb-4057-9510-82ed3add5d18",
            "75621c0a-ff01-4f46-8183-932341941435",
            "42d0baec-7f5c-4b0d-8d04-27085c0d9a72",
            "eda2ead5-80f3-4c79-ac65-978dee370bbb",
            "f7fcfe2d-57aa-4530-bce1-b5828ed7e5e0",
            "201cc942-daeb-4b56-ab82-ebe64a45f6dc",
            "eff0755f-4c94-46d6-8168-68fdb2beaa69",
            "823fe389-1f02-42e7-b07a-ddad2d94ad61",
            "a0d99a16-3f4b-4a9a-a1fd-c2347d580681",
            "b02e06c6-491e-4729-b296-98df88c8a3d1",
            "e3113e6e-ac46-4720-a561-b777dce64741",
            "37084ba2-3dbb-4f03-a592-7f605049685b",
            "4618506d-ba8a-4b2d-bb8d-99959c1ab6b5",
            "749da953-6868-4502-ac6f-d754177a20cc",
            "dd8e58bc-9846-4f19-933e-5732ad3ab476",
            "2d27e585-441c-432e-b482-aa43071faba2",
            "a173824a-b922-413a-bc67-fca0eb47caee",
            "fa0b129e-d709-4222-98f9-10ca527cefee",
        ],
    },
    {
        id: "gamma2",
        name: "A Doomed Universe",
        teams: [
            "0a97ca74-8f4e-409e-98ab-95c191235251",
            "9bbf84a7-0dfd-48cd-b843-82b10528eec2",
            "e8036bc3-2474-4502-9a08-3bfd48c025c2",
            "6be45876-852c-4e19-b5e0-a45cd2064b91",
            "eaba6b33-3b5c-49c0-b9e7-e288e10c0887",
            "18e1b74b-adba-486d-8a59-4af972f5e8ab",
            "2f7798ca-4fd2-4504-97a9-b9260f4d6ffd",
            "923cbe98-c3db-45e0-b5c4-087873322b80",
            "a6352f14-365d-40bd-8832-892f3a259082",
            "f10a6439-99bb-4f0b-a4ce-5ed34ead7154",
            "8c2d39c2-372b-48b3-9bf2-740456550b9a",
            "3b492c27-64ab-4810-8e4d-cabeab2ff5e1",
            "1cb1e984-8492-4f34-a064-75290283377e",
            "15add592-d974-4e05-a823-f34212b70742",
            "a2fa8b39-4a63-434e-84ad-e3b2b9277a6b",
            "831f3ffa-d8eb-4374-a84d-89afb2841a21",
            "28d1b8da-9b7f-4f38-8dfd-de15786e8014",
            "870ab8e0-9334-4e74-966c-52543813e336",
            "1255db2f-66bd-49b0-8efc-ad10e9a04e82",
            "c3b958ec-27d7-4e6d-87ae-96d0acc8483a",
            "67369079-2340-4743-890c-81cbf5a7fea7",
            "f19728c5-79bc-4b97-be77-b24879240efe",
            "51469e55-8958-4c0d-a36d-2b4039158c54",
            "602d34a0-a233-44f2-9bc7-484ca7c3932e",
        ],
    },
    {
        id: "gamma3",
        name: "A Lost Reality",
        teams: [
            "88fb8e45-c333-472f-9d00-a1fba251eed0",
            "e4d94c95-159d-4bdf-b1ec-4a6f7864ebcd",
            "4340bfc8-af94-49c8-ab5e-60161950e29b",
            "6f82a3e1-7e5f-423c-b824-57478679514c",
            "7651f2e3-0e50-4249-b26d-453456b0d5e3",
            "74d38fdc-71b4-4f27-a59a-f2a56e003d4a",
            "7a3cd762-ab6a-4523-839f-ad8b74a11472",
            "b43e1d50-4004-4b42-9e93-adfae57ff93e",
            "e29d175c-cdcb-4fe9-917c-d536e352c1df",
            "692cf3f7-1efe-4e63-842a-58624f4408f9",
            "c5fff599-b308-4865-addc-0503607db667",
            "1f306062-78cb-4652-a0ae-ea75547e35bb",
            "b5df2f80-adfe-4bf5-a313-cb138ef1e4e3",
            "f9df6b5e-08da-4d4e-baf9-c348771c4746",
            "f21d2ebc-9e3d-4c80-8dbf-244610c206f1",
            "1b40e511-4e26-48e0-8a30-b7c48843c822",
            "798edd95-f2da-4f4f-8149-c5732e24c327",
            "86f62a74-d54e-4aa1-b5d4-0b3e90f8e2c5",
            "d0fb871f-46f8-4c22-8552-e672f4980319",
            "3106a275-9c4e-4206-b53b-0fa552c20661",
            "6678de2a-6358-47a5-aabc-09cfd96bd7d3",
            "9a80e496-d098-45c4-a475-ae80af7b8f27",
            "f90f4e79-b9c6-4787-9588-9ac1501f325f",
            "db412596-60ab-4616-95ae-550ace59561a",
        ],
    },
    {
        id: "gamma5",
        name: "Abandoned Gamma5",
        teams: [
            "cade1731-39a8-43f3-be8e-d2302711fe8b",
            "3cea1405-3a5f-432c-96c3-a85dc7f163ee",
            "110a62be-bc8a-4f0c-8046-0eb580b1af1c",
            "f9045b82-5570-43d4-856b-bed5095515c6",
            "70167f08-5e85-44d7-b047-2961201c1615",
            "a922603d-30c6-48d1-a83b-ae9be96675b6",
            "e12313fe-c0c9-49de-9d11-8b7408aa92ce",
            "780054a7-74ee-44fd-ab5f-6dd4637c5ef1",
            "34a2e6ca-08fd-468e-894b-c707d6ce460a",
            "5663778c-c8fb-4408-908a-31dc1f6c55cc",
            "2de5c38c-3d72-4d97-af0f-15e98eba2225",
            "d2874e7f-8e88-442a-a176-e256df68a49b",
            "5666fce7-3b39-4ade-9220-71244d9be5d8",
            "bebf13f9-82d1-4133-9b14-4a96de029ccf",
            "86435ed2-d205-4c37-be22-89683b9a7a62",
            "a554e084-b483-42da-89fb-39cd49ad7df6",
            "9657f04e-1c51-4951-88de-d376bb57f5bd",
            "5d3bd8ab-cc9a-4aa5-bbcd-fa0f96566c64",
            "378e3344-1a1a-4332-80cc-3da45954a4f4",
            "ba6d5599-1242-41ed-be64-90de7b1c255f",
        ],
    },
    {
        id: "gamma6",
        name: "Abandoned Gamma6",
        teams: [
            "e4f7549c-17af-4e35-b89b-f0fae855a31b",
            "444f2846-8927-4271-b2ca-6bf8b5b94610",
            "2d07beca-bdb1-4ecb-bcfe-5913e2b406f5",
            "ca117809-cda1-4ae0-b607-53079fb5b133",
            "16be150e-372e-453e-b6ff-597aa42ca5ee",
            "635c332d-6ea9-4766-b391-ae4c3435f677",
            "09a77dd0-13c6-4c18-870a-63cd005ddff6",
            "ea3c8019-b6b6-4830-b952-7e9c2ce707bd",
            "4d5f27b5-8924-498f-aa4c-7f5967c0c7c6",
            "cd29d13d-99d4-414b-8faa-f0819b2de526",
            "074b5e4a-84f8-428d-884e-4592a77ee061",
            "71b157bc-8a50-4c05-a785-034f660e493f",
            "0a449b4d-504b-448c-9516-6027fd6d216e",
            "fca16c92-5f03-45b9-abbe-760866878ffe",
            "6e655fc7-5190-4e55-99a0-89683d443cfc",
            "2d02b60b-d858-4b8a-a835-c1e8fe1b8fe0",
            "9685b9a9-8765-49e1-88ca-c153ad0276d0",
            "4b1004bc-345e-4084-8d18-b46315624864",
            "365b4517-4b0a-45da-aaa6-161dd77de99a",
            "c794d5aa-6104-420e-ae6f-3b2c270253fd",
        ],
    },
    {
        id: "gamma7",
        name: "Abandoned Gamma7",
        teams: [
            "4cf31f0e-fb42-4933-8fdb-fde58d109ced",
            "f8d99dc7-ae37-4f35-b08c-543864a347f2",
            "3aba36e6-9dd7-417f-9d3a-69d778439020",
            "b5b4fb6b-08d8-401a-85d5-f08afa84af63",
            "2ec5927e-9905-408c-a04c-65a8879f846a",
            "99edf2f4-f47d-46ee-998a-4cb4200236f7",
            "11b92425-aa46-4691-b42f-baa2b6ddb541",
            "b7f9cc0c-6a6c-4bed-adbb-2d2d2dfbe810",
            "7ce9e0b0-9639-45f1-8db6-32c30ca0012d",
            "f3490435-a42f-42a8-ab89-d59e8dc8d599",
            "c0dc2c80-463e-49f7-9e00-c62473d677c8",
            "d2c33336-b5a9-4ce1-86bb-f376ec66efbd",
            "628bb28b-306e-4ff7-ad02-05524bcf246a",
            "cc9de838-4431-4cc7-9c3e-15b15b2142b0",
            "8aaf714b-d42a-40b0-9165-384befc66d55",
            "8756d8e1-bd9d-4116-8fd0-5ea06c2e80c3",
            "910974d7-cbfd-4d2d-8733-7e85759932da",
            "0eae657b-3592-43fb-93e1-b878680d2b53",
            "3b1c5a25-ed79-4ce2-87d4-0c1cf3ff342e",
            "ae0661b9-af66-4d4b-acc7-041e5cccb4bb",
        ],
    },
]

export default class Team {
    public readonly id: string;
    public readonly data: BlaseballTeam;
    public readonly type: string;

    constructor(data: ChroniclerEntity<BlaseballTeam>, isSpecial?: boolean) {
        this.id = data.entityId
        this.data = data.data
        this.type = isSpecial ? "special" : (groups.find((group) => group.teams.includes(this.id))?.id ?? "unknown")
    }

    canonicalLocation() : string {
        return this.data.state?.scattered?.location ?? this.data.location
    }

    canonicalName() : string {
        return this.data.state?.scattered?.fullName ?? this.data.fullName;
    }

    canonicalNickname() : string {
        return this.data.state?.scattered?.nickname ?? this.data.nickname;
    }

    modifications() {
        return [
            ...(this.data.gameAttr ?? []),
            ...(this.data.weekAttr ?? []),
            ...(this.data.seasAttr ?? []),
            ...(this.data.permAttr ?? []),
        ]
    }

    slug() : string {
        if(this.data.fullName === "nullteam" || this.type === "unknown") {
            return this.id;
        }
        if(this.id === "9494152b-99f6-4adb-9573-f9e084bc813f") {
            return "baltimore-clabs";
        }
        return this.canonicalName().toLowerCase().replace(/&/g, "-and-").replace(/[,.']+/g, "").replace(/[-\s]+/g, "-") + (this.type?.startsWith("gamma") ? ("-" + this.type) : "");
    }
}

export const groupTeams = (teams: Team[]) => {
    const navGroups = groups
        .map((group) => {
            const foundTeams = group.teams.map((id) => teams.find((team) => team.id === id)).filter((team): team is Team => team !== undefined)
            foundTeams.sort(shorthandComparator)
            return {
                id: group.id,
                name: group.name,
                teams: foundTeams,
            }
        })
        .filter((group) => group.teams.length)
    const ungroupedTeams = teams.filter((team) => team.type === "unknown")
    ungroupedTeams.sort(shorthandComparator)

    return {
        special: [AllPlayers, AllTeams, TheArmory, StatSqueezer, /*TheHall,*/],
        groups: navGroups,
        ungrouped: ungroupedTeams,
    }
}

export function shorthandComparator(team1: Team, team2: Team) {
    return team1.data.shorthand.localeCompare(team2.data.shorthand);
}

function getSpecialTeam(props: SpecialTeamProps) {
    return new Team(<ChroniclerEntity<BlaseballTeam>>{
        entityId: props.id,
        validFrom: "",
        validTo: null,
        data: <BlaseballTeam>{
            emoji: props.emoji,
            fullName: props.fullName,
            id: props.id,
            lineup: [],
            location: "",
            mainColor: props.mainColor,
            nickname: "",
            rotation: [],
            secondaryColor: props.secondaryColor,
            shadows: [],
            shorthand: props.shorthand,
            slogan: props.slogan,
            stadium: null,
        },
    }, true)
}

export const AllPlayers = getSpecialTeam({
    emoji: "0x26BE",
    fullName: "The Players",
    id: "players",
    mainColor: "#424242",
    secondaryColor: "#aaaaaa",
    shorthand: "All Players",
    slogan: "We are all love Blaseball.",
})

export const AllTeams = getSpecialTeam({
    emoji: "0x1FA78",
    fullName: "Choose a team to begin",
    id: "teams",
    mainColor: "#8f3232",
    secondaryColor: "#c58585",
    shorthand: "All Teams",
    slogan: "Pick your favorite.",
})

export const TheArmory = getSpecialTeam({
    emoji: "0x2694",
    fullName: "The Armory & Bargain Bin",
    id: "items",
    mainColor: "#e9e837",
    secondaryColor: "#ede47b",
    shorthand: "The Armory",
    slogan: "Remember to stop by the gift shop!",
})

export const StatSqueezer = getSpecialTeam({
    emoji: "0x1F9EE",
    fullName: "The Stat Squeezer",
    id: "squeezer",
    mainColor: "#885a84",
    secondaryColor: "#da94d4",
    shorthand: "Stat Squeezer",
    slogan: "Freshly squeezed stats.",
})

export const TheHall = getSpecialTeam({
    emoji: "0x1F3DB",
    fullName: "The Hall of Flame",
    id: "tributes",
    mainColor: "#5988ff",
    secondaryColor: "#5988ff",
    shorthand: "Hall of Flame",
    slogan: "Pay tribute.",
})