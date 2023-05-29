const router = require("express").Router();

let cat = [
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F22b43183aa35ccc0d7fd26d1356d486aa.jpg?alt=media&token=f60f2b30-512d-4ffe-b379-1de621b816ae",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F04cabdcb3b7631d7abdb2a15e113a75a7.jpg?alt=media&token=4b996f27-a7cb-4c7c-ac41-846b185074d4",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F003c1154b0e50b0078b7edde4ca2168ea.jpg?alt=media&token=bad56cfc-db83-4cf5-89f1-46ea95299dc0",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F7222dd6e6dd727fa33037d205b014775d.jpg?alt=media&token=749b9747-02df-4c41-a6d2-ba17f0136eb6",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F84566eb2040143a8ddd1fc22b8d1377ca.jpg?alt=media&token=2ca5f1b5-34b5-4361-9b20-ef7d1d0c5e4a",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F5db565a556750fb72ee665075aa84c3b8.jpg?alt=media&token=45ca55d3-c6e7-470d-9905-f40593f779b4",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Faad6858f0a4a5db514b71f60b5caad640.jpg?alt=media&token=1b4f23c4-08ee-458a-bc16-c21fab079177",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F8a8232db463c88855b431476a6d66a4eb.jpg?alt=media&token=eceb0243-3a71-463f-8a96-a645d7fff7b4",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fbdfb56eda8c26506f78b55520f0b81131.jpg?alt=media&token=7e60c7f8-8d45-41ca-ae06-bc87e1b4035e",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F5aabd0b3221a4f66254082444268585b4.jpg?alt=media&token=e0e6bcfc-3ed4-4b2c-91a4-43494248c025",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F0afdbf5366eaa667d2f5a5dcc16ffe4bf.jpg?alt=media&token=7703adcf-bb82-487d-b6fc-163f574524ca",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F3de875dae6857aa26f0aa7e3700ff8280.jpg?alt=media&token=572b1c03-603d-43ec-a0e5-1c73f1dc8044",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fc42f6e2e6ee62aba858cca162354058bc.jpg?alt=media&token=86d7ae96-138f-44ad-ac0d-17418deddd92",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fa3ea24b3aa61fb6fc6512fb48348f7565.jpg?alt=media&token=09acdbca-f7f5-448c-8abd-420e555fd912",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F00e01cc173026a658f4603b806680f4b7.jpg?alt=media&token=766755b9-7e38-4d92-979e-1c2a7cc1f387",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F3da8bbdd567e5d7d7d10de3c3ed562d08.jpg?alt=media&token=4ca23dfd-a09e-4ccd-9eb8-816614c71f9d",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F1e325e5f83fdfec11ae11f322b7acdbd8.jpg?alt=media&token=d63d2631-6c80-4a3f-ad36-b8983d7e1dbd",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F47f77c15a8cc154b8a14ed483a1f63fd8.jpg?alt=media&token=27984fe0-d38c-43b5-a6c2-9ac78fa4205f",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fcabbd4181dcd7421cbda0721ef05a3db4.jpg?alt=media&token=e118dc4f-37d0-410c-82ef-8451b157d785",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F2c47a871244f0dd56ba7c177a7628011e.jpg?alt=media&token=e9039c8f-8862-4aa2-b6d1-58a698018445",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F38e7e3736bbf2e06814d56a7df1ad14c5.jpg?alt=media&token=e3c0f77a-65dd-4d6d-ac77-ba6d8ac02dd2",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F804db7fb747f61acecde50af47c8500e2.jpg?alt=media&token=adb2f5e2-974e-4e84-8c3b-8b4299e8378d",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F386f587ff5421163ae3c842504d767c0f.jpg?alt=media&token=a5b18827-8125-4271-a231-11a0cd154f1e",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fa086b1c57cc67d1f2bfdfacdb706c40d7.jpg?alt=media&token=134e9047-e28e-48cf-a774-a72a5f1184af",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F24bec878af215ef8ff4178b7c647f2ad5.jpg?alt=media&token=9025c920-9177-426a-ae34-bf62e04b3c39",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F2b75833a4b318742fd038adecd8ce4a0c.jpg?alt=media&token=40733b36-df2d-40e0-a982-95b3fde4320e",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fa2bcaec5df63538d3273f31bce5a2326b.jpg?alt=media&token=13b8ffbc-3e46-407b-9d32-a07027f9f5e4",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F665f2a7edb3d38735cce37e1d37f6e70e.jpg?alt=media&token=340b2290-f416-46fd-a946-e1e409c47ce9",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F2e63daca33ac7f1bd444e4b2e25207766.jpg?alt=media&token=8b2a0935-0a27-46c0-8d79-3eecd1e191bb",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F6b515848fb5cdbc777e3712267363040b.jpg?alt=media&token=ab7e3961-9aa6-4429-882f-7773861d5cda",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F4e4f20c12aaeb4d4232b7b2d3e1f3f337.jpg?alt=media&token=cbe9f5fc-9529-4314-8d46-b7f89ab08667",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F6de7460ade7b2fd786b5c71e140ea563b.jpg?alt=media&token=260e0a78-6387-47b5-b7c4-4301ac7f7b77",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fadf40bc62baacb663f6b78f40bd84daba.jpg?alt=media&token=36088809-abc1-4c5f-8a85-50d4fe52a9df",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F3fdf2b1272d8f6df0b215c10e1c50e1e2.jpg?alt=media&token=71734692-5636-4eb5-a523-e13a0fdcbe04",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F575c602ab25413f10761eeb3b8405d51b.jpg?alt=media&token=1e187bb7-16e1-4524-9b7d-7e8d1d6b93a0",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F62bcfbecc5200530238068dde1e0dcd18.jpg?alt=media&token=bc10d490-0f6d-4825-8eb9-79f995a896f8",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F686cc8c53a3c106c0bae086ddf4e2244d.jpg?alt=media&token=7157e596-d39c-420f-af8e-e5abaaf220ff",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F21361614256386bd42810adcbb1175c52.jpg?alt=media&token=739094bc-a530-46a4-a188-12eb77a26d37",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F4581c51bff370743550577ae55cbf3d58.jpg?alt=media&token=35ea2f94-a1a8-42cc-9fbe-1bff4257a35a",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F8fe151ec817765ea223f46f0630fde212.jpg?alt=media&token=291ea6ba-8dae-48b2-b271-fc9577975031",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fe5ccc276fb5712c6be8beacd45c276bed.jpg?alt=media&token=174f00ea-5121-47c6-9289-aed33ed85167",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F156e7ddb7c6ffe6560123fa73de6ccea7.jpg?alt=media&token=3f3dcec4-0054-4c5f-b65b-e1e8bd62845b",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F3dceb0754acbf64561a7067fcf6354fe1.jpg?alt=media&token=f2c3806f-0f24-42b3-bab1-fb89c553f0ed",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F4f4ec830eed425d1b7601f48b5c5f27f1.jpg?alt=media&token=d71d2409-6b85-437c-be9b-a0c18a1e09f6",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F3d60202a8a610f681ebf08e26e5710c30.jpg?alt=media&token=1c452626-0654-4115-b68d-017a3ecd9dd1",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F0040f64442e64c5443b8178fb7a4a103e.jpg?alt=media&token=18b391b1-2777-4286-9cbd-33e520456228",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F2f2efa4a6eb81ce47665010c05251a4e7.jpg?alt=media&token=89c6ae14-99d8-48c5-9f6f-074a98adfe8f",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F340363a7ad036a6dfa6f116e5c43e8847.jpg?alt=media&token=918deb8c-945a-49cd-ab10-8bd2129daa57",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fa282235784726aaf720f1a35db310e1cd.jpg?alt=media&token=564cc2a9-eeff-48a1-9e7b-1aa81dcbaa78",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F436a80f57c0f38238ecbdc036754821f5.jpg?alt=media&token=18bf17a6-c712-4b07-a34d-7eb77f92374a",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F2fc1623e00774ccdf5567c4e2a6348bc3.jpg?alt=media&token=69353133-aac6-4014-a485-fb26fe3f15dd",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fab26e8420c5ea15e377a8f758080ba10e.jpg?alt=media&token=511729cd-7917-42d8-a4da-a4a7557ed803",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fadf71be72b85022ae4c78267771dacf35.jpg?alt=media&token=14f2e3ec-1bd4-4ed4-a472-e63179c8e101",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F8bc333b2a45055ec8cb8d0a8f63171635.jpg?alt=media&token=eb4d2976-561f-4f57-acd0-d77ccfdd6b20",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F336712e0a8e21267eb1c27bf2a1f82f52.jpg?alt=media&token=ca0916d8-069c-4769-b40b-0060323d64bc",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F7ce021bd51dc5622fd27748dea8d1354e.jpg?alt=media&token=85023729-883e-400d-93e2-5760ebd2c9d4",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F8df4e7ea8fa8601a6adbe6ad57bbe2bcd.jpg?alt=media&token=7f4ce68a-b984-47c3-a3f3-72edc26a5cd1",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F45cd8767daace3d3ed77a00aa851cc268.jpg?alt=media&token=7ef868db-f053-461c-a20d-6c97481db025",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F8c026ff6ca41e4a5cf7818643402054b7.jpg?alt=media&token=385215ba-2c5f-46d1-871f-1874646cf97e",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F432fe1655b036e00b8c87c6e667678a2b.jpg?alt=media&token=ff61f769-fe1e-41dc-833b-da817fc76f2e",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F3eaae6754cc0e7740876047ffb8f55e4e.jpg?alt=media&token=aca532c1-7488-4f7a-a440-288a395263b5",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fa6fbf3f476d7332caf86e6ca73ba7738f.jpg?alt=media&token=37e77b78-a499-4d04-b2eb-b02eed6fcaa8",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fbb1d3cd8bd0482d2e611e110e032adbf0.jpg?alt=media&token=0d27f9eb-404e-4559-9688-fe9509b83fa1",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fe6f7adfd8f7e3bab1e17e52521746e4a3.jpg?alt=media&token=6852a382-2e9f-4c48-8d12-5484fe277759",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fa0ef2f60f308ed75d6d2b181ec7b107cd.jpg?alt=media&token=13d8948c-3d1b-489f-92ee-b16c2cc24227",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F36144036d27e4ded838be4f34df67a5f7.jpg?alt=media&token=295c42fc-e328-4434-96b8-75d2ec40398f",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fd774601c3e564f262f78dc81681b67c62.jpg?alt=media&token=42217860-6075-446b-882a-4d0f3165e083",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F81d3a46fc455a0d38f772b4c667ae104e.jpg?alt=media&token=f1a607e3-ae8d-4c10-ac72-749ce9ca565b",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fdb220dce6ad56d2632d1c4d48e1a04f20.jpg?alt=media&token=e7663a6c-fbfe-4023-bee9-b122eb2a59d0",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F4ee48da8f1bd5a6f373ec822cbee830fe.jpg?alt=media&token=af9f1a1e-76c6-4919-a441-d49c69b818df",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fcdebc6c450bd018e71fca51762b4b7b34.jpg?alt=media&token=277973bb-fe29-4cd0-aa09-7e15261396fc",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fe82fc0ffb88e88aea437af2ddda335e4b.jpg?alt=media&token=a1cece84-de55-4048-a273-2441ef01e54a",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F32c5262f531861fd8d71744c64d37ecda.jpg?alt=media&token=bd0a3469-2a4c-46e6-8338-15e5251b56a0",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Ffbaa5e58fee63d8f5fecb147e3e44226d.jpg?alt=media&token=6fe9fec4-fdf0-4c0b-97cf-0cc2bddf4369",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fdc62c2ee72556a333ed457000833b605e.jpg?alt=media&token=f513cfac-09d6-490f-b9ce-9f9a5729b59c",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fdd7e0ad50f117883e621ac6fe83edb27f.jpg?alt=media&token=3e887e88-3428-4f0c-9df7-896ceffe0d46",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fdf4ae574ced057fb7d60647033c61a860.jpg?alt=media&token=076a2770-6caa-4b8f-ba8a-ea0aed230ab8",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fe300e3341f576b0114ed5305bb65ce76d.jpg?alt=media&token=65d09c06-a28f-43ae-9ea7-2c0cfe13e258",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Ffdc447c7e88b0034df7bdb1cfd74c7028.jpg?alt=media&token=1d0ba217-acf3-46a7-8fb5-b8989b67dfab",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Ffb037a51844006c8fa562f7b376d7caf7.jpg?alt=media&token=2927cb87-54ee-4d37-9f74-cecd8b6c6bc5",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Ff23b33f14ae347ba668c05a5d854ba3d5.jpg?alt=media&token=dca2b38e-c568-4880-83ff-a3ccdf0fde29",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fea605020766b825236876a5cd57a2815d.jpg?alt=media&token=9b31fc60-1736-4349-ad98-b4923a8f486a",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Ff5778d7d35ab1ca6dd733dc3fc41f58ce.jpg?alt=media&token=570e6124-da56-4b49-abbb-34ef56c83801",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Ffcb512824382f35c41557067f48c6ff07.jpg?alt=media&token=583a1f26-7d60-4285-ba36-ea4a62bc1215",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F7886e001330b215000758fdfef43c7260.jpg?alt=media&token=95a089c7-96ff-405b-85a2-1dd0bbb6ea96",
];

let dog = [
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F2b68bca2adfc5f8ec0f72e7ee50684c18.jpg?alt=media&token=8cec6127-7110-468d-9903-9bc5b1a7cc05",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F2c30a2e1684273b17433a45bc4e802d28.jpg?alt=media&token=ce38c059-1c35-4c01-a8a6-38fba3b00a0a",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F5f51fc0c35ed370b65765532332f7ef8d.jpg?alt=media&token=b23f6f1e-9b1c-42ce-b2c4-fed73df17a51",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F0be4c08563471dce8c4ceea5d743bdf0f.jpg?alt=media&token=d0f79467-5889-4880-9b21-22857a2e6b30",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F1e76540baa55226660c73d1b5b312a84a.jpg?alt=media&token=5cd9d51c-21a0-4b15-8da3-18031e18c959",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F7d11ed4cc86ef41f262c2d570ebfa7eec.jpg?alt=media&token=eeea9f74-6ed3-4998-9dfc-1b8c28513e81",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F3bdeada5a5eec20d5f27c54a72f055dcc.jpg?alt=media&token=1985b53a-1537-40a3-8a52-5cbba93314fa",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F5350e5f36718aaf230fbb865372dc6052.jpg?alt=media&token=556c5460-16a3-4915-9d87-b6fd4893fa27",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F3fc555f1ab20700ebb5c28e558326caa2.jpg?alt=media&token=d2eb534b-04f5-4f80-83bd-985da2df65c1",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F0a085722dbb2534b6d38eb55850cb1815.jpg?alt=media&token=8537ddf5-96d0-4426-8987-331a46a2e920",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F03a727162664d7d7ce266ded38a1005c3.jpg?alt=media&token=06131513-e081-46a2-acbe-3d59cd6f60ee",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F2a477e625d7d063c6b8712a8ed06f1d80.jpg?alt=media&token=29ce184c-970d-49c8-8b96-c5abc29a77d6",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F01eb7e81374c0883bc543370df1638e1b.jpg?alt=media&token=0cc92bd4-51db-4715-85bf-1b0286905478",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F4cf1cc06206b06e7c1c5cae5e45d78dcf.jpg?alt=media&token=cb274c9d-58cd-4548-b673-818161699c86",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F7e0e38d816ced3006447afc3da1482ccc.jpg?alt=media&token=fc6d6e44-c1e6-414a-8696-cc7683b08769",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F2ea136b4332141c43f6d65ac203d11520.jpg?alt=media&token=b0ccbb6f-7889-4831-be60-e3d94b273dd9",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F8b386e85f372222bf6e0b2f53a17371ff.jpg?alt=media&token=898fb639-55b6-4aa7-b24f-4bc4ff3ef933",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F13c34bb4c330fdf0bf73511d53750f117.jpg?alt=media&token=723eeb50-1ade-45d4-981b-77499293cba2",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F2f08108433cdb2b3c5d0872bc4ce141be.jpg?alt=media&token=98331eb2-df1c-4ed1-b32c-7c709dca355b",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F4a208704e245c5611b3fb1a08521a626a.jpg?alt=media&token=b3a45874-ca3e-4ff5-9e82-09edfeb36234",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F5fa4cefbc5d7a56ce7cf48ce5e26a0bb4.jpg?alt=media&token=cd095f99-401e-4be5-84fd-251a8216e19b",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F3bd1385c36f33ffc0a2c03313babfcd42.jpg?alt=media&token=499c28a7-5474-45f4-87ae-fbaa133a9bc8",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F4e4f5ecf83011b6312522fe5b2088a811.jpg?alt=media&token=25f4df10-4f5e-4dd3-aaed-0df4caad0746",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F7daadcddafc34142eaed8c530f0d007a2.jpg?alt=media&token=42df8d5e-eb9a-4e96-811b-907214f6e06c",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F4bbdd12fbb178c0d3a40463bcb11f1c8c.jpg?alt=media&token=a18fb081-a14b-44ee-918d-fc2e0123a259",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F5a613a85132cf5c656eee56ea861e5bba.jpg?alt=media&token=c1304981-d4a7-4392-a55a-4f73b009a210",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F480823fd0fca24730dd206dc14e4c3ea6.jpg?alt=media&token=8f26b09a-81cc-4344-a827-3a9321a48eb0",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F67dee2ad73c7b41e6e0ef5bae33058df2.jpg?alt=media&token=095236f0-7a19-4dbb-b0c9-39399d4fe746",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F45f16543afb32366bac1f38450e624877.jpg?alt=media&token=2d35b194-9ae1-4223-b7d6-358b7eb7aba0",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F21a0c10fddf7535ddadc52ba32a0230e5.jpg?alt=media&token=84c425ff-21cd-4407-86e2-d8cdc9ec764f",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F474d6e06c2f87d111dafcfb240f06cb75.jpg?alt=media&token=f4770ddf-aaa2-4b81-8956-2c0b5dbaed3d",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fa2442ed6bdb765cc256ed28acf076df1c.jpg?alt=media&token=1e376e21-3dba-4045-b98f-cfcdbbb7a344",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F4002a4e01051b45711dcd8a6ca4721806.jpg?alt=media&token=f8d54a8d-9029-4e36-86f1-1fb34b1c826e",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F110d7304e0bb8c473315865234ee5444b.jpg?alt=media&token=0f328ffc-b053-487e-b1cb-69b926ad0319",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F2f33ed8c830b3e722544e8f1b62edad84.jpg?alt=media&token=14f92cef-e344-41d1-b60c-28d02a7fc08c",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F65cf1e4d50e43f1264bf5c04c0c37036c.jpg?alt=media&token=ef56dfcc-5589-4bdd-8205-9eec099ce5c2",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F14d0a62e57baef5fa614e03860f5f122f.jpg?alt=media&token=f4860501-3f69-43d8-8a40-a0e6fb989be8",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F64630acb0cb715be70d5e15a40bd175bf.jpg?alt=media&token=7504cd13-8ebe-4550-a19d-45fd51db0031",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F5a3de46123aa84e4fc4aaa081afa66788.jpg?alt=media&token=8dcec564-816e-4082-9286-6185c3d8f0c8",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F42af0321c568e50f6577d32ecafa1507b.jpg?alt=media&token=9d77ec95-db07-4389-be05-53dca194e856",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F53a688d6a545cddbe0ea228660edd732e.jpg?alt=media&token=49b557ee-3495-4e15-8f59-f5c6a060e4ae",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fbb2c6dc51180d16c7b1584cac0de831a7.jpg?alt=media&token=08523cc9-950b-4d88-94d5-347dc00ed7ca",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fa73bcba806f2336a50dbcac578ad84cc8.jpg?alt=media&token=6f165470-9140-4cac-9dcb-7750f6269497",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fb13471b4f04dc0eced2f7005c2bf8bd16.jpg?alt=media&token=2a5fe05e-70f5-4060-a4ae-55deec0c539d",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F665d77c756e6bae18dcf67885337acda7.jpg?alt=media&token=ff8fa6ff-33b5-44ba-baf9-2d9786388187",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F1427b5a510a7053a03d2de35f55d3d8ca.jpg?alt=media&token=e72b801f-31a2-46bf-bd31-ce00820c2e55",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F5cc2a87b43d1c7d368c2ede75788822fa.jpg?alt=media&token=65399a2f-393a-4f9f-b2ef-b363ea7da0b4",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F7602e4240b835b5cce768aa545007af0c.jpg?alt=media&token=c9044577-6d3d-492b-89fa-621644cdea0a",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F3446c3484c5b30872a4be10a668303638.jpg?alt=media&token=9e9885f4-9f81-4615-8335-5808fca34493",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F2537460f4372122624822a26d6ba8cba6.jpg?alt=media&token=a04b607d-a61a-4124-8025-f62cb4a1a06b",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fab525168cdd55be425c8803840ce388e1.jpg?alt=media&token=49e01a20-d0d3-4027-b0bb-5e99b26fe5e4",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fb0c0f36db03c82aac16668718ac8a8271.jpg?alt=media&token=da010da1-ecfb-4f52-a206-ce6a51e6879d",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fb40b424760823f6511d77fb85dfd18ff8.jpg?alt=media&token=d9f4676f-bd96-41f4-971a-b855bddbec23",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F332427121edef686504f224e1cbcaef50.jpg?alt=media&token=e8effc0b-9a96-486d-8af7-c45569b8cfcc",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fb5bcc7b2f2786120542012536615c732c.jpg?alt=media&token=2ab1a8f5-3420-4c58-9690-10db520c0ee6",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fb1d6102ef52f7263ccdfd83562ceb724f.jpg?alt=media&token=34801d88-0aac-4998-8738-bf55bd23d2b2",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fb01dca8d431bf2dceb22576d58641a43c.jpg?alt=media&token=366f143e-e021-4786-b226-85770b21a5ce",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fc53d7765a80fd575c275b4a0462735024.jpg?alt=media&token=ba6050f2-863d-4239-b0a3-4c9f1807d677",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fb61cfb8c33be5e03530e6c5e67cc7dc7a.jpg?alt=media&token=2ba76ed6-4416-4f5d-9715-58540aedf1c0",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fc5f13aad68e074136cc8e1d56a4b81aba.jpg?alt=media&token=9f6e8632-ace0-41f3-8b7f-d6277507eef8",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fae675f6643c3bafb0c4fcca67871b31ca.jpg?alt=media&token=e9d59e64-607b-4fe6-b24a-5e5a95cc5449",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fa741acd703bcd5c13311f6b61a7ddd0c7.jpg?alt=media&token=b3d81282-baae-45dd-a52e-538336bf2059",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F62c5142df25ceca64fb7725056b4af1d8.jpg?alt=media&token=c7b6dae9-7e62-4ca9-abf9-d614bd5df0f8",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fac5b04e8b7b83b0fa8c357cb20e5e32ee.jpg?alt=media&token=841f3bfc-0c8f-4037-a7bc-9d67553ede51",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fc357b834070d87f408d5a03a0a5b636b1.jpg?alt=media&token=22afc3f9-a2e5-4070-b48c-b9f250d3aaf9",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fbed718e4beb80f7706e5a32a0eefe008f.jpg?alt=media&token=11890adb-4aa1-4e2b-8887-5c6e2450b4e1",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fbffac8613a56818bea758f185a362f43d.jpg?alt=media&token=8dad112e-8246-4040-b215-fd3df98fef6c",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fd7efe84877404400f6ce05601efeeae4c.jpg?alt=media&token=06d44135-674b-4ca2-bfcc-d10b75a8124d",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fcb02e3584c85e4b2d2088264d07e3b6ab.jpg?alt=media&token=e1b597ef-f423-4eba-ba35-906eb8210646",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fcf30bb30254e0c8cb7b7b63e4e640f3e7.jpg?alt=media&token=8676edec-7699-48e3-baf7-395975a2f45a",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fd8ef8b6dc8e3c04e45e127c3e0cde4386.jpg?alt=media&token=cf60dd60-c502-4983-a164-6651184c8508",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fe4ad415b50ec125242dafff50d35037e0.jpg?alt=media&token=a0c49689-3d2d-470c-957f-9669d818c022",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fdd76b5768c44ace16f3fecf87dd6d0837.jpg?alt=media&token=5de466dd-052d-4a35-8938-072c415730d6",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fe5557dfc058408baaf0e250342c6fa662.jpg?alt=media&token=4eeff8b2-ada5-4a31-bf27-40cd323c521e",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fefda462b67fe2c762e0acf403faaf780f.jpg?alt=media&token=76a55064-7dde-4d94-aa63-914157ec245c",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fdc72f1211784e7fbd05ca4a46dca5a53d.jpg?alt=media&token=603b78f0-edd4-405e-8b45-040d9683e1fc",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Ff73cb0f268ea276e866cbc3ab21347701.jpg?alt=media&token=6d3a3835-a263-42c3-a6f7-7f5f46dd9d04",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Ff5a34853b205ce126e6025362c00c72d4.jpg?alt=media&token=ff9bd863-80ac-4e38-b8d0-513e7089095b",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Feb842cd0e42af66ff4a336bd48f3b2bfc.jpg?alt=media&token=e83c9ae8-2995-4d23-9b54-090ce1c9a67e",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Ffd0e01feb1ab01848ddf53ce3b17567b6.jpg?alt=media&token=5c05ab6c-dcb0-4386-8f2d-45d0f2c221c5",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F4e88b74bc851430380801d2157fe1ede7.jpg?alt=media&token=2394d55d-4055-41ca-9876-41e097015f69",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F34c55dfa4787fa434d7bca50f274a521c.jpg?alt=media&token=b9c70a77-9691-42b9-91b8-1e3a77a62a77",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F4a8fd6267f070724275d0aab86bdfe6bb.jpg?alt=media&token=a908b12d-2cb5-469b-9b21-cba54b9c2052",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2F73624aac3111d471dbad1bdb52f86be17.jpg?alt=media&token=087807b0-5964-4d60-9674-5a2d84e51d9c",
	"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/folder%2Fea5e516065161855432878141cc2f3651.jpg?alt=media&token=c971e7e4-b976-4ddb-8108-2fdbb4fda60a",
];

const catDog = (animal) => {
	if (animal == 0) {
		return cat[Math.floor(Math.random() * (cat.length - 1))];
	} else {
		return dog[Math.floor(Math.random() * (dog.length - 1))];
	}
};

module.exports = catDog;