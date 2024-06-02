"use client";
import {
  GoogleMap,
  LoadScript,
  Marker,
  StandaloneSearchBox,
  Polygon
} from "@react-google-maps/api";
import "./map.css";
import "../app/Cuenta/Usuario/Estadisticas/style.css";
 
import { useEffect, useState } from "react";
const polygon = [
  { lat: 19.592749, lng: -99.12369 },
  { lat: 19.588528, lng: -99.126953 },
  {lat:19.562376, lng:-99.148988},
  {lat: 19.561968, lng:-99.149132},
  {lat: 19.560557, lng:-99.150888},
  {lat: 19.561376, lng:-99.151612},
  {lat: 19.561962, lng:-99.15281},
  {lat: 19.561556, lng:-99.153323},
  {lat: 19.561374, lng:-99.154237},
  {lat: 19.560155, lng:-99.156144},
  {lat: 19.557315, lng:-99.158033},
  {lat: 19.556494, lng:-99.158047},
  {lat: 19.555921, lng:-99.157714},
  {lat: 19.555451, lng:-99.157521},
  {lat: 19.555007, lng:-99.15758},
  {lat: 19.553655, lng:-99.158034},
  {lat: 19.549253, lng:-99.16089},
  {lat: 19.549103, lng:-99.160071},
  {lat: 19.549219, lng:-99.15969},
  {lat: 19.549179, lng:-99.159202},
  {lat: 19.548976, lng:-99.159373},
  {lat: 19.548812, lng:-99.158524},
  {lat: 19.548325, lng:-99.158644},
  {lat: 19.544832, lng:-99.151088},
  {lat: 19.541285, lng:-99.153298},
  {lat: 19.54008, lng:-99.154085},
  {lat: 19.535278, lng:-99.158038},
  {lat: 19.533955, lng:-99.158488},
  {lat: 19.532451, lng:-99.155833},
  {lat: 19.528846, lng:-99.158587},
  {lat: 19.528093, lng:-99.156803},
  {lat: 19.527252, lng:-99.158823},
  {lat: 19.526904, lng:-99.159153},
  {lat: 19.531436, lng:-99.174142},
  {lat: 19.531882, lng:-99.174951},
  {lat: 19.532036, lng:-99.175972},
  {lat: 19.530729, lng:-99.176349},
  {lat: 19.530658, lng:-99.17629},
  {lat: 19.529434, lng:-99.177039},
  {lat: 19.529327, lng:-99.177036},
  {lat: 19.528867, lng:-99.176151},
  {lat: 19.530092, lng:-99.175363},
  {lat: 19.527194, lng:-99.171378},
  {lat: 19.523865, lng:-99.17484},
  {lat: 19.523462, lng:-99.174172},
  {lat: 19.522056, lng:-99.169963},
  {lat: 19.517952, lng:-99.162973},
  {lat: 19.502807, lng:-99.157027},
  {lat: 19.506045, lng:-99.167006},
  {lat: 19.507806, lng:-99.170792},
  {lat: 19.508605, lng:-99.173042},
  {lat: 19.508237, lng:-99.173599},
  {lat: 19.50808, lng:-99.173781},
  {lat: 19.50767, lng:-99.174527},
  {lat: 19.507402, lng:-99.175438},
  {lat: 19.506968, lng:-99.176019},
  {lat: 19.506194, lng:-99.177049},
  {lat: 19.507514, lng:-99.182195},
  {lat: 19.507526, lng:-99.182384},
  {lat: 19.507767, lng:-99.182933},
  {lat: 19.508233, lng:-99.184332},
  {lat: 19.508635, lng:-99.185335},
  {lat: 19.509046, lng:-99.186161},
  {lat: 19.509962, lng:-99.18857},
  {lat: 19.509973, lng:-99.188962},
  {lat: 19.510586, lng:-99.191476},
  {lat: 19.511153, lng:-99.191847},
  {lat: 19.511979, lng:-99.194397},
  {lat: 19.512706, lng:-99.196644},
  {lat: 19.513744, lng:-99.200128},
  {lat: 19.51513, lng:-99.204681},
  {lat: 19.514999, lng:-99.204944},
  {lat: 19.514376, lng:-99.205878},
  {lat: 19.513974, lng:-99.206618},
  {lat: 19.512839, lng:-99.208753},
  {lat: 19.512675, lng:-99.208928},
  {lat: 19.512451, lng:-99.209114},
  {lat: 19.510877, lng:-99.210175},
  {lat: 19.509218, lng:-99.210629},
  {lat: 19.50789, lng:-99.211177},
  {lat: 19.506698, lng:-99.211443},
  {lat: 19.504896, lng:-99.211719},
  {lat: 19.503641, lng:-99.211924},
  {lat: 19.50047, lng:-99.212834},
  {lat: 19.498459, lng:-99.213424},
  {lat: 19.495115, lng:-99.214504},
  {lat: 19.489164, lng:-99.216609},
  {lat: 19.487399, lng:-99.217228},
  {lat: 19.484041, lng:-99.218331},
  {lat: 19.481769, lng:-99.219143},
  {lat:19.479088, lng:-99.22008},
  {lat:19.478205, lng:-99.220398},
  {lat:19.476859, lng:-99.220721},
  {lat:19.475042, lng:-99.221143},
  {lat:19.474533, lng:-99.219228},
  {lat:19.473167, lng:-99.21422},
  {lat:19.472316, lng:-99.210824},
  {lat:19.471153, lng:-99.206734},
  {lat:19.469585, lng:-99.20717},
  {lat:19.47007, lng:-99.208744},
  {lat:19.46938, lng:-99.209916},
  {lat:19.467969, lng:-99.211309},
  {lat:19.467949, lng:-99.211465},
  {lat:19.467093, lng:-99.211748},
  {lat:19.467103, lng:-99.212145},
  {lat:19.462923, lng:-99.213545},
  {lat:19.462436, lng:-99.212645},
  {lat:19.460404, lng:-99.213944},
  {lat:19.45952, lng:-99.214042},
  {lat:19.458569, lng:-99.214242},
  {lat:19.456496, lng:-99.215178},
  {lat:19.456193, lng:-99.21533},
  {lat:19.453553, lng:-99.217583},
  {lat:19.45334, lng:-99.218066},
  {lat:19.452921, lng:-99.219268},
  {lat:19.45287, lng:-99.219968},
  {lat:19.452107, lng:-99.219956},
  {lat:19.451824, lng:-99.219921},
  {lat:19.450114, lng:-99.220044},
  {lat:19.44771, lng:-99.220135},
  {lat:19.446096, lng:-99.22015},
  {lat:19.445598, lng:-99.219997},
  {lat:19.445112, lng:-99.219636},
  {lat:19.444742, lng:-99.219191},
  {lat:19.444243, lng:-99.218234},
  {lat:19.444116, lng:-99.218138},
  {lat:19.444035, lng:-99.218191},
  {lat:19.443959, lng:-99.218771},
  {lat:19.443797, lng:-99.220183},
  {lat:19.443676, lng:-99.220628},
  {lat:19.441553, lng:-99.223594},
  {lat:19.440772, lng:-99.224428},
  {lat:19.438519, lng:-99.227656},
  {lat:19.438368, lng:-99.227865},
  {lat:19.43814, lng:-99.228032},
  {lat:19.437985, lng:-99.228069},
  {lat:19.437818, lng:-99.228032},
  {lat:19.436759, lng:-99.227264},
  {lat:19.436759, lng:-99.227264},
  {lat:19.436207, lng:-99.227191},
  {lat:19.435849, lng:-99.227246},
  {lat:19.435373, lng:-99.227464},
  {lat:19.435246, lng:-99.227468},
  {lat:19.434953, lng:-99.227414},
  {lat:19.434859, lng:-99.227362},
  {lat:19.434745, lng:-99.227255},
  {lat:19.434057, lng:-99.22622},
  {lat:19.43386, lng:-99.226152},
  {lat:19.432752, lng:-99.226421},
  {lat:19.432256, lng:-99.226674},
  {lat:19.43153, lng:-99.226871},
  {lat:19.431327, lng:-99.226838},
  {lat:19.431059, lng:-99.226503},
  {lat:19.430421, lng:-99.225118},
  {lat:19.429681, lng:-99.223636},
  {lat:19.429468, lng:-99.223334},
  {lat:19.42924, lng:-99.223174},
  {lat:19.428296, lng:-99.222867},
  {lat:19.427661, lng:-99.222708},
  {lat:19.427348, lng:-99.222585},
  {lat:19.427085, lng:-99.222284},
  {lat:19.426884, lng:-99.222374},
  {lat:19.426646, lng:-99.222631},
  {lat:19.426418, lng:-99.222744},
  {lat:19.427074, lng:-99.224397},
  {lat:19.426707, lng:-99.225155},
  {lat:19.426646, lng:-99.225472},
  {lat:19.426515, lng:-99.225783},
  {lat:19.426241, lng:-99.225957},
  {lat:19.425594, lng:-99.226134},
  {lat:19.424309, lng:-99.227008},
  {lat:19.424248, lng:-99.22718},
  {lat:19.424227, lng:-99.227555},
  {lat:19.424166, lng:-99.227743},
  {lat:19.424039, lng:-99.227829},
  {lat:19.423655, lng:-99.22785},
  {lat:19.423559, lng:-99.227928},
  {lat:19.423503, lng:-99.228317},
  {lat:19.423408, lng:-99.228467},
  {lat:19.423176, lng:-99.228666},
  {lat:19.422682, lng:-99.228906},
  {lat:19.422227, lng:-99.22937},
  {lat:19.421815, lng:-99.230115},
  {lat:19.4217, lng:-99.230841},
  {lat:19.421591, lng:-99.230903},
  {lat:19.420964, lng:-99.231064},
  {lat:19.420823, lng:-99.2312},
  {lat:19.420722, lng:-99.23156},
  {lat:19.420158, lng:-99.231668},
  {lat: 19.419965, lng:-99.231812},
  {lat: 19.419765, lng:-99.232348},
  {lat: 19.419533, lng:-99.232383},
  {lat: 19.419386, lng:-99.232507},
  {lat: 19.419412, lng:-99.232909},
  {lat: 19.419401, lng:-99.232971},
  {lat: 19.419012, lng:-99.23297},
  {lat: 19.418592, lng:-99.233091},
  {lat: 19.41838, lng:-99.233052},
  {lat: 19.418054, lng:-99.23319},
  {lat: 19.417899, lng:-99.233204},
  {lat: 19.417272, lng:-99.233108},
  {lat: 19.416683, lng:-99.233841},
  {lat: 19.416686, lng:-99.233984},
  {lat: 19.416636, lng:-99.234102},
  {lat: 19.416055, lng:-99.234633},
  {lat: 19.415459, lng:-99.235425},
  {lat: 19.41523, lng:-99.235582},
  {lat: 19.412698, lng:-99.236898},
  {lat: 19.412186, lng:-99.237634},
  {lat: 19.412006, lng:-99.238401},
  {lat: 19.41221, lng:-99.239622},
  {lat: 19.412194, lng:-99.239933},
  {lat: 19.411773, lng:-99.2412},
  {lat: 19.411303, lng:-99.242321},
  {lat: 19.410788, lng:-99.243008},
  {lat: 19.410714, lng:-99.243365},
  {lat: 19.410542, lng:-99.243682},
  {lat: 19.409921, lng:-99.244238},
  {lat: 19.408803, lng:-99.247532},
  {lat: 19.408788, lng:-99.247955},
  {lat: 19.408636, lng:-99.248315},
  {lat: 19.40801, lng:-99.24895},
  {lat: 19.407233, lng:-99.250074},
  {lat: 19.40696, lng:-99.250364},
  {lat: 19.406676, lng:-99.250562},
  {lat: 19.406408, lng:-99.25097},
  {lat: 19.406234, lng:-99.251673},
  {lat: 19.405716, lng:-99.252859},
  {lat: 19.405095, lng:-99.253338},
  {lat: 19.404857, lng:-99.254361},
  {lat: 19.404554, lng:-99.254869},
  {lat: 19.403572, lng:-99.25581},
  {lat: 19.403555, lng:-99.256034},
  {lat: 19.402539, lng:-99.256015},
  {lat: 19.400726, lng:-99.256668},
  {lat: 19.400488, lng:-99.256871},
  {lat: 19.400432, lng:-99.256973},
  {lat: 19.402366, lng:-99.258123},
  {lat: 19.402522, lng:-99.258236},
  {lat: 19.403098, lng:-99.25825},
  {lat: 19.403964, lng:-99.258004},
  {lat: 19.40432, lng:-99.257778},
  {lat: 19.404551, lng:-99.257712},
  {lat: 19.404844, lng:-99.257696},
  {lat: 19.404844, lng:-99.2579},
  {lat: 19.404758, lng:-99.258131},
  {lat: 19.404068, lng:-99.258674},
  {lat: 19.403744, lng:-99.258824},
  {lat: 19.403222, lng:-99.25895},
  {lat: 19.402562, lng:-99.259022},
  {lat: 19.401793, lng:-99.259222},
  {lat: 19.401459, lng:-99.259072},
  {lat: 19.400542, lng:-99.259869},
  {lat: 19.400264, lng:-99.260444},
  {lat: 19.399973, lng:-99.260895},
  {lat: 19.399655, lng:-99.261128},
  {lat: 19.399327, lng:-99.2613},
  {lat: 19.399655, lng:-99.261128},
  {lat: 19.399325, lng:-99.261303},
  {lat: 19.399259, lng:-99.261646},
  {lat: 19.399315, lng:-99.261845},
  {lat: 19.399609, lng:-99.26207},
  {lat: 19.399669, lng:-99.262161},
  {lat: 19.399715, lng:-99.262419},
  {lat: 19.399663, lng:-99.262752},
  {lat: 19.399527, lng:-99.263176},
  {lat: 19.399491, lng:-99.263573},
  {lat: 19.39942, lng:-99.263916},
  {lat: 19.399218, lng:-99.264061},
  {lat: 19.399013, lng:-99.26399},
  {lat: 19.398749, lng:-99.264007},
  {lat: 19.398678, lng:-99.264098},
  {lat: 19.398678, lng:-99.264404},
  {lat: 19.398713, lng:-99.264607},
  {lat: 19.398825, lng:-99.264843},
  {lat: 19.398966, lng:-99.26494},
  {lat: 19.398941, lng:-99.265079},
  {lat: 19.398689, lng:-99.265383},
  {lat: 19.39819, lng:-99.26576},
  {lat: 19.397361, lng:-99.266105},
  {lat: 19.396087, lng:-99.266431},
  {lat: 19.395531, lng:-99.26676},
  {lat: 19.394089, lng:-99.267972},
  {lat: 19.393575, lng:-99.268055},
  {lat: 19.392667, lng:-99.268104},
  {lat: 19.392135, lng:-99.26831},
  {lat: 19.39167, lng:-99.269016},
  {lat: 19.391553, lng:-99.269257},
  {lat: 19.391356, lng:-99.269466},
  {lat: 19.391002, lng:-99.269617},
  {lat: 19.390623, lng:-99.269538},
  {lat: 19.390375, lng:-99.269565},
  {lat: 19.390202, lng:-99.269946},
  {lat: 19.389733, lng:-99.271848},
  {lat: 19.389682, lng:-99.272422},
  {lat: 19.389377, lng:-99.272776},
  {lat: 19.388997, lng:-99.27291},
  {lat: 19.388376, lng:-99.272995},
  {lat: 19.387576, lng:-99.273215},
  {lat: 19.387233, lng:-99.273605},
  {lat: 19.387022, lng:-99.273679},
  {lat: 19.385193, lng:-99.276064},
  {lat: 19.385577, lng:-99.276053},
  {lat: 19.383543, lng:-99.27871},
  {lat: 19.382977, lng:-99.278844},
  {lat: 19.382589, lng:-99.279352},
  {lat: 19.382184, lng:-99.27983},
  {lat: 19.381581, lng:-99.280672},
  {lat: 19.381408, lng:-99.28283},
  {lat: 19.380452, lng:-99.283291},
  {lat: 19.379977, lng:-99.283772},
  {lat: 19.379679, lng:-99.28382},
  {lat: 19.379793, lng:-99.284252},
  {lat: 19.379768, lng:-99.284456},
  {lat: 19.379677, lng:-99.284574},
  {lat: 19.379366, lng:-99.284672},
  {lat: 19.379106, lng:-99.284846},
  {lat: 19.379035, lng:-99.285044},
  {lat: 19.378858, lng:-99.285114},
  {lat: 19.378008, lng:-99.28507},
  {lat: 19.377627, lng:-99.285668},
  {lat: 19.377232, lng:-99.285716},
  {lat: 19.376434, lng:-99.2857},
  {lat: 19.376426, lng:-99.286399},
  {lat: 19.376502, lng:-99.286903},
  {lat: 19.376684, lng:-99.287665},
  {lat: 19.375777, lng:-99.288066},
  {lat: 19.375095, lng:-99.28865},
  {lat: 19.375147, lng:-99.288987},
  {lat: 19.375195, lng:-99.289571},
  {lat: 19.374994, lng:-99.289717},
  {lat: 19.375015, lng:-99.290606},
  {lat: 19.374309, lng:-99.290771},
  {lat: 19.374023, lng:-99.291069},
  {lat: 19.373841, lng:-99.291133},
  {lat: 19.373487, lng:-99.291181},
  {lat: 19.373482, lng:-99.291675},
  {lat: 19.373279, lng:-99.292056},
  {lat: 19.372344, lng:-99.292908},
  {lat: 19.371901, lng:-99.293242},
  {lat: 19.371196, lng:-99.293419},
  {lat: 19.370159, lng:-99.293884},
  {lat: 19.369918, lng:-99.294452},
  {lat: 19.369871, lng:-99.29478},
  {lat: 19.369072, lng:-99.295591},
  {lat: 19.369411, lng:-99.297479},
  {lat: 19.369333, lng:-99.297893},
  {lat: 19.369161, lng:-99.298193},
  {lat: 19.368867, lng:-99.29845},
  {lat: 19.367525, lng:-99.299043},
  {lat: 19.369716, lng:-99.301231},
  {lat: 19.370614, lng:-99.300879},
  {lat: 19.37213, lng:-99.301082},
  {lat: 19.374916, lng:-99.30155},
  {lat: 19.375746, lng:-99.301939},
  {lat: 19.377054, lng:-99.301308},
  {lat: 19.377841, lng:-99.303479},
  {lat: 19.376816, lng:-99.305013},
  {lat: 19.373587, lng:-99.306126},
  {lat: 19.37155, lng:-99.307749},
  {lat: 19.371578, lng:-99.309269},
  {lat: 19.370406, lng:-99.310724},
  {lat: 19.37021, lng:-99.312558},
  {lat: 19.369936, lng:-99.313422},
  {lat: 19.369299, lng:-99.313817},
  {lat: 19.368478, lng:-99.314036},
  {lat: 19.367245, lng:-99.314515},
  {lat: 19.36608, lng:-99.315417},
  {lat: 19.3663, lng:-99.316867},
  {lat: 19.365736, lng:-99.317616},
  {lat: 19.364823, lng:-99.318053},
  {lat: 19.364159, lng:-99.318116},
  {lat: 19.363612, lng:-99.319539},
  {lat: 19.360918, lng:-99.321141},
  {lat: 19.358158, lng:-99.3181},
  {lat: 19.357987, lng:-99.318557},
  {lat: 19.357623, lng:-99.319158},
  {lat: 19.357709, lng:-99.320114},
  {lat: 19.358193, lng:-99.320751},
  {lat: 19.358511, lng:-99.321554},
  {lat: 19.358668, lng:-99.322225},
  {lat: 19.358498, lng:-99.322823},
  {lat: 19.358346, lng:-99.32329},
  {lat: 19.35795, lng:-99.323761},
  {lat: 19.356429, lng:-99.32466},
  {lat: 19.356017, lng:-99.325034},
  {lat: 19.355714, lng:-99.32505},
  {lat: 19.355532, lng:-99.325311},
  {lat: 19.355001, lng:-99.325717},
  {lat: 19.354607, lng:-99.325834},
  {lat: 19.353671, lng:-99.326382},
  {lat: 19.354136, lng:-99.32743},
  {lat: 19.35405, lng:-99.327672},
  {lat: 19.353627, lng:-99.327711},
  {lat: 19.35334, lng:-99.328037},
  {lat: 19.353097, lng:-99.328482},
  {lat: 19.352117, lng:-99.328828},
  {lat: 19.351391, lng:-99.328642},
  {lat: 19.350678, lng:-99.328741},
  {lat: 19.350349, lng:-99.328848},
  {lat: 19.349985, lng:-99.328652},
  {lat: 19.349615, lng:-99.328373},
  {lat: 19.349479, lng:-99.32833},
  {lat: 19.348479, lng:-99.3286},
  {lat: 19.3479, lng:-99.328707},
  {lat: 19.347596, lng:-99.32853},
  {lat: 19.346809, lng:-99.328448},
  {lat: 19.346047, lng:-99.328797},
  {lat: 19.345627, lng:-99.328883},
  {lat: 19.345192, lng:-99.328272},
  {lat: 19.344249, lng:-99.328708},
  {lat: 19.343861, lng:-99.328749},
  {lat: 19.343622, lng:-99.328948},
  {lat: 19.342939, lng:-99.329141},
  {lat: 19.342292, lng:-99.329492},
  {lat: 19.341625, lng:-99.329737},
  {lat: 19.34099, lng:-99.330338},
  {lat: 19.340053, lng:-99.33067},
  {lat: 19.339782, lng:-99.331149},
  {lat: 19.339415, lng:-99.331204},
  {lat: 19.338782, lng:-99.331193},
  {lat: 19.338444, lng:-99.33147},
  {lat: 19.337788, lng:-99.331696},
  {lat: 19.336641, lng:-99.33164},
  {lat: 19.334985, lng:-99.331909},
  {lat: 19.333544, lng:-99.332298},
  {lat: 19.332404, lng:-99.332798},
  {lat: 19.330584, lng:-99.333835},
  {lat: 19.306682, lng:-99.356604},
  {lat: 19.302005, lng:-99.35628},
  {lat: 19.296842, lng:-99.350004},
  {lat: 19.297396, lng:-99.353492},
  {lat: 19.296048, lng:-99.352921},
  {lat: 19.294969, lng:-99.351259},
  {lat: 19.294157, lng:-99.351495},
  {lat: 19.294148, lng:-99.351962},
  {lat: 19.293989, lng:-99.352424},
  {lat: 19.293386, lng:-99.353458},
  {lat: 19.293274, lng:-99.354523},
  {lat: 19.29193, lng:-99.353594},
  {lat: 19.27777, lng:-99.36492},
  {lat: 19.275745, lng:-99.361922},
  {lat: 19.273952, lng:-99.348223},
  {lat: 19.273043, lng:-99.347536},
  {lat: 19.272234, lng:-99.346492},
  {lat: 19.272032, lng:-99.346293},
  {lat: 19.271324, lng:-99.346157},
  {lat: 19.270809, lng:-99.34584},
  {lat: 19.269474, lng:-99.34469},
  {lat: 19.268868, lng:-99.343484},
  {lat: 19.268539, lng:-99.343055},
  {lat: 19.26809, lng:-99.341539},
  {lat: 19.267781, lng:-99.340933},
  {lat: 19.267697, lng:-99.339149},
  {lat: 19.264036, lng:-99.337631},
  {lat: 19.259653, lng:-99.339859},
  {lat: 19.258401, lng:-99.340102},
  {lat: 19.255393, lng:-99.340687},
  {lat: 19.251973, lng:-99.341349},
  {lat: 19.250214, lng:-99.341631},
  {lat: 19.247554, lng:-99.342062},
  {lat: 19.241126, lng:-99.342335},
  {lat: 19.237927, lng:-99.330828},
  {lat: 19.232571, lng:-99.326719},
  {lat: 19.232668, lng:-99.321303},
  {lat: 19.2292, lng:-99.31535},
  {lat: 19.221506, lng:-99.316244},
  {lat: 19.213716, lng:-99.307133},
  {lat: 19.206147, lng:-99.306138},
  {lat: 19.202642, lng:-99.304678},
  {lat: 19.200514, lng:-99.304441},
  {lat: 19.198256, lng:-99.303958},
  {lat: 19.197191, lng:-99.303916},
  {lat: 19.192473, lng:-99.30304},
  {lat: 19.190863, lng:-99.30277},
  {lat: 19.188427, lng:-99.301336},
  {lat: 19.171233, lng:-99.295017},
  {lat: 19.14661, lng:-99.287611},
  {lat: 19.1317, lng:-99.278699},
  {lat: 19.096064, lng:-99.226774},
  {lat: 19.096064, lng:-99.226774},
  {lat: 19.095581, lng:-99.220267},
  {lat: 19.094859, lng:-99.210558},
  {lat: 19.09283, lng:-99.18293},
  {lat: 19.089296, lng:-99.13538},
  {lat: 19.062067, lng:-99.12544},
  {lat: 19.048726, lng:-99.062089},
  {lat: 19.050706, lng:-99.058686},
  {lat: 19.075759, lng:-99.043207},
  {lat: 19.08538, lng:-99.028992},
  {lat: 19.078765, lng:-98.983587},
  {lat: 19.074464, lng:-98.978999},
  {lat: 19.079565, lng:-98.973695},
  {lat: 19.083149, lng:-98.968283},
  {lat: 19.085855, lng:-98.965724},
  {lat: 19.090964, lng:-98.963703},
  {lat: 19.092116, lng:-98.96324},
  {lat: 19.095589, lng:-98.961242},
  {lat: 19.104283, lng:-98.959064},
  {lat: 19.10905, lng:-98.95895},
  {lat: 19.111306, lng:-98.958413},
  {lat: 19.112565, lng:-98.95869},
  {lat: 19.113651, lng:-98.958703},
  {lat: 19.11963, lng:-98.95766},
  {lat: 19.122379, lng:-98.957504},
  {lat: 19.133064, lng:-98.961104},
  {lat: 19.135687, lng:-98.962386},
  {lat: 19.139816, lng:-98.964603},
 {lat: 19.140414, lng:-98.965118},
 {lat: 19.143876, lng:-98.966451},
 {lat: 19.145892, lng:-98.962553},
 {lat: 19.149527, lng:-98.954637},
 {lat: 19.153662, lng:-98.958161},
 {lat: 19.156472, lng:-98.960559},
 {lat: 19.157043, lng:-98.961045},
 {lat: 19.164444, lng:-98.967357},
 {lat: 19.168645, lng:-98.952393},
 {lat: 19.176772, lng:-98.956184},
 {lat: 19.176643, lng:-98.956521},
 {lat: 19.179169, lng:-98.959841},
 {lat: 19.187032, lng:-98.966399},
 {lat: 19.189742, lng:-98.9677},
 {lat: 19.197936, lng:-98.966978},
 {lat: 19.199908, lng:-98.967031},
 {lat: 19.203121, lng:-98.967696},
 {lat: 19.204254, lng:-98.969686},
 {lat: 19.206132, lng:-98.967494},
 {lat: 19.206243, lng:-98.967226},
 {lat: 19.206651, lng:-98.96716},
 {lat: 19.207046, lng:-98.967182},
 {lat: 19.207337, lng:-98.967419},
 {lat: 19.207632, lng:-98.967049},
 {lat: 19.209006, lng:-98.966832},
 {lat: 19.210484, lng:-98.96837},
 {lat: 19.21056, lng:-98.968531},
 {lat: 19.210588, lng:-98.96808},
 {lat: 19.210705, lng:-98.967812},
 {lat: 19.210989, lng:-98.967625},
 {lat: 19.211663, lng:-98.967156},
 {lat: 19.211872, lng:-98.966759},
 {lat: 19.213241, lng:-98.964311},
 {lat: 19.213048, lng:-98.963531},
 {lat: 19.214151, lng:-98.962693},
 {lat: 19.213882, lng:-98.959754},
 {lat: 19.214414, lng:-98.960033},
 {lat: 19.215125, lng:-98.95745},
 {lat: 19.214648, lng:-98.953952},
 {lat: 19.21544, lng:-98.953679},
 {lat: 19.215273, lng:-98.952896},
 {lat: 19.215501, lng:-98.953261},
 {lat: 19.216248, lng:-98.952378},
 {lat: 19.218177, lng:-98.951085},
 {lat: 19.215627, lng:-98.942552},
 {lat: 19.223232, lng:-98.940307},
 {lat: 19.224621, lng:-98.944765},
 {lat: 19.224915, lng:-98.945236},
 {lat: 19.224966, lng:-98.945926},
 {lat: 19.226967, lng:-98.952196},
 {lat: 19.228803, lng:-98.957907},
 {lat: 19.23024, lng:-98.962392},
 {lat: 19.232217, lng:-98.96858},
 {lat: 19.249937, lng:-98.965991},
 {lat: 19.253127, lng:-98.976533},
 {lat: 19.257013, lng:-98.975543},
 {lat: 19.259478, lng:-98.974917},
 {lat: 19.261166, lng:-98.974606},
 {lat: 19.268156, lng:-98.973277},
 {lat: 19.279267, lng:-98.971293},
 {lat: 19.287926, lng:-98.969952},
 {lat: 19.305964, lng:-98.96722},
 {lat: 19.305955, lng:-98.966284},
 {lat: 19.30637, lng:-98.965345},
 {lat: 19.306893, lng:-98.964768},
 {lat: 19.307927, lng:-98.964397},
 {lat: 19.315006, lng:-98.963342},
 {lat: 19.316706, lng:-98.962971},
 {lat: 19.323226, lng:-98.9579},
 {lat: 19.329757, lng:-98.965679},
 {lat: 19.331936, lng:-98.968261},
 {lat: 19.33702, lng:-98.974292},
 {lat: 19.338358, lng:-98.975497},
 {lat: 19.339109, lng:-98.975984},
 {lat: 19.342131, lng:-98.977806},
 {lat: 19.343272, lng:-98.978782},
 {lat: 19.344294, lng:-98.979842},
 {lat: 19.347231, lng:-98.982884},
 {lat: 19.351324, lng:-98.987139},
 {lat: 19.351923, lng:-98.987763},
 {lat: 19.355217, lng:-98.991207},
 {lat: 19.356696, lng:-98.992937},
 {lat: 19.358147, lng:-98.994554},
 {lat: 19.35853, lng:-98.994554},
 {lat: 19.35885, lng:-98.994454},
 {lat: 19.359063, lng:-98.994165},
 {lat: 19.360411, lng:-98.993458},
 {lat: 19.367002, lng:-98.99175},
 {lat: 19.367473, lng:-98.991793},
 {lat: 19.367609, lng:-98.991938},
 {lat: 19.378208, lng:-99.009968},
 {lat: 19.38302, lng:-99.019123},
 {lat: 19.38434, lng:-99.021902},
 {lat: 19.390096, lng:-99.034615},
 {lat: 19.397857, lng:-99.051604},
 {lat: 19.399334, lng:-99.054853},
 {lat: 19.400699, lng:-99.05814},
 {lat: 19.411277, lng:-99.057026},
 {lat: 19.417497, lng:-99.056395},
 {lat: 19.417538, lng:-99.056416},
 {lat: 19.418783, lng:-99.056246},
 {lat: 19.421844, lng:-99.055852},
 {lat: 19.422285, lng:-99.055745},
 {lat: 19.424297, lng:-99.05519},
 {lat: 19.426, lng:-99.054381},
 {lat: 19.43051, lng:-99.052351},
 {lat: 19.435036, lng:-99.050411},
 {lat: 19.439635, lng:-99.048211},
 {lat: 19.442351, lng:-99.046446},
 {lat: 19.44314, lng:-99.047133},
 {lat: 19.443828, lng:-99.047369},
 {lat: 19.44499, lng:-99.048019},
 {lat: 19.446293, lng:-99.048725},
 {lat: 19.448705, lng:-99.050053},
 {lat: 19.450724, lng:-99.051147},
 {lat: 19.45255, lng:-99.051933},
 {lat: 19.458461, lng:-99.0545},
 {lat: 19.466268, lng:-99.057932},
 {lat: 19.471117, lng:-99.060074},
 {lat: 19.479531, lng:-99.063715},
 {lat: 19.480007, lng:-99.063967},
 {lat: 19.480732, lng:-99.064241},
 {lat: 19.481305, lng:-99.064494},
 {lat: 19.481528, lng:-99.064543},
 {lat: 19.48166, lng:-99.064698},
 {lat: 19.481872, lng:-99.064873},
 {lat: 19.48891, lng:-99.067835},
 {lat: 19.489079, lng:-99.06799},
 {lat: 19.493722, lng:-99.066087},
 {lat: 19.49513, lng:-99.065466},
 {lat: 19.496537, lng:-99.06484},
 {lat: 19.498771, lng:-99.063869},
 {lat: 19.499385, lng:-99.065445},
 {lat: 19.504089, lng:-99.077651},
 {lat: 19.506326, lng:-99.082807},
 {lat: 19.50767, lng:-99.085884},
 {lat: 19.508983, lng:-99.089052},
 {lat: 19.509456, lng:-99.09038},
 {lat: 19.511141, lng:-99.094105},
 {lat: 19.512083, lng:-99.096173},
 {lat: 19.512636, lng:-99.097389},
  {lat: 19.511286, lng:-99.10341},
  {lat: 19.510321, lng:-99.105508},
  {lat: 19.509889, lng:-99.105928},
  {lat: 19.510172, lng:-99.106136},
  {lat: 19.510424, lng:-99.106572},
  {lat: 19.510176, lng:-99.107034},
  {lat: 19.509691, lng:-99.107293},
  {lat: 19.511026, lng:-99.107631},
  {lat: 19.510454, lng:-99.107829},
  {lat: 19.510498, lng:-99.108635},
  {lat: 19.511097, lng:-99.108962},
  {lat: 19.510303, lng:-99.109429},
  {lat: 19.510439, lng:-99.109904},
  {lat: 19.511036, lng:-99.110232},
  {lat: 19.511175, lng:-99.110592},
  {lat: 19.511066, lng:-99.114403},
  {lat: 19.513055, lng:-99.115922},
  {lat: 19.513243, lng:-99.116877},
  {lat: 19.516186, lng:-99.120876},
  {lat: 19.516239, lng:-99.121033},
  {lat: 19.521217, lng:-99.125892},
  {lat: 19.524075, lng:-99.12739},
  {lat: 19.524525, lng:-99.127999},
  {lat: 19.525882, lng:-99.128179},
  {lat: 19.531707, lng:-99.127379},
  {lat: 19.535077, lng:-99.127373},
  {lat: 19.536095, lng:-99.130574},
  {lat: 19.539336, lng:-99.128185},
  {lat: 19.541661, lng:-99.125966},
  {lat: 19.542948, lng:-99.124968},
  {lat: 19.544025, lng:-99.12421},
  {lat: 19.54545, lng:-99.122725},
  {lat: 19.549137, lng:-99.121038},
  {lat: 19.552189, lng:-99.118469},
  {lat: 19.554031, lng:-99.115615},
  {lat: 19.55666, lng:-99.115712},
  {lat: 19.564893, lng:-99.108096},
  {lat: 19.568726, lng:-99.111808},
  {lat: 19.579776, lng:-99.114643},
  {lat: 19.581451, lng:-99.116902},
  {lat: 19.584453, lng:-99.118585},
  {lat: 19.590585, lng:-99.117876},
  {lat: 19.591994, lng:-99.119454},
];

const Map = ({ setSelectedLocation }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [searchBox, setSearchBox] = useState(null);
  const DEFAULT_LATITUDE = 19.4540124; // batiz
const DEFAULT_LONGITUDE = -99.1750683; // batiz
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setMarkerPosition({ lat: latitude, lng: longitude });
          const location = await reverseGeocode(${latitude},${longitude});
          setSelectedLocation(location); // Pasa la dirección al componente padre
        },
        (error) => {
          console.error("Error getting user location:", error);
          // Si el usuario no permite la geolocalización, mover el marcador a coordenadas predeterminadas
          setMarkerPosition({ lat: DEFAULT_LATITUDE, lng: DEFAULT_LONGITUDE });
          setSelectedLocation("Mar Mediterráneo 227, Popotla, Miguel Hidalgo, 11320 Ciudad de México, CDMX");
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  async function reverseGeocode(coordinates) {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
      const response = await fetch(
        https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates}&key=${apiKey}
      );
      const data = await response.json();

      if (data.status !== "OK" || data.results.length === 0) {
        console.error(
          No se encontraron resultados para las coordenadas: ${coordinates}
        );
        return null;
      }

      const address = data.results[0].formatted_address;
      return address;
    } catch (error) {
      console.error(
        Error al obtener la ubicación para las coordenadas ${coordinates}:,
        error
      );
      return null;
    }
  }

  const handleMarkerDragEnd = async (event) => {
    const latlng = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };
    const isInsidePolygon = google.maps.geometry.poly.containsLocation(
      new google.maps.LatLng(latlng.lat, latlng.lng),
      new google.maps.Polygon({ paths: polygon })
    );
    if (isInsidePolygon) {
    setMarkerPosition(latlng);
    const location = await reverseGeocode(${latlng.lat},${latlng.lng});
    setSelectedLocation(location); // Pasa la dirección al componente padre
    }else{
      setMarkerPosition({ lat: DEFAULT_LATITUDE, lng: DEFAULT_LONGITUDE });
      setSelectedLocation("Mar Mediterráneo 227, Popotla, Miguel Hidalgo, 11320 Ciudad de México, CDMX");
      alert("Detectamos una ubicación fuera de la CDMX, por favor intenta de nuevo");
    }
  };

  const handleOnLoad = (ref) => {
    setSearchBox(ref);
  };

  const handlePlacesChanged = async () => {
    if (!searchBox) return;
  
    const places = searchBox.getPlaces();
    
    if (places.length === 0) {
      alert("No se encontraron ubicaciones válidas.");
      return;
    }
  
    // Definir límites de la Ciudad de México
    const cdmxBounds = {
      north: 19.593686, // Latitud máxima (norte)
      south: 19.188838, // Latitud mínima (sur)
      west: -99.326787, // Longitud mínima (oeste)
      east: -98.960547, // Longitud máxima (este)
    };
  
    // Filtrar lugares dentro de los límites de la Ciudad de México
    const cdmxPlaces = places.filter(place => {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      return (
        lat >= cdmxBounds.south &&
        lat <= cdmxBounds.north &&
        lng >= cdmxBounds.west &&
        lng <= cdmxBounds.east
      );
    });
  
    if (cdmxPlaces.length === 0) {
      alert("No se encontraron ubicaciones dentro de la Ciudad de México, recuerda que solo se permiten ubicaciones dentro de la CDMX.");
      return;
    }
  
    // Tomar el primer lugar dentro de los límites de la Ciudad de México
    const { geometry } = cdmxPlaces[0];
    const latlng = {
      lat: geometry.location.lat(),
      lng: geometry.location.lng()
    };
  
    // Establecer la posición del marcador y obtener la ubicación inversa
    setMarkerPosition(latlng);
    const location = await reverseGeocode(${latlng.lat},${latlng.lng});
    setSelectedLocation(location);
  };
  
  

  const mapStyles = {
    height: "80vh",
    width: "59vw",
  };

  const defaultCenter = {
    lat: 19.453986,
    lng: -99.17505,
  };
  const libraries = ["places"];
 return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}   libraries={libraries}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={10.4}
        center={defaultCenter}
        options={{
          restriction: {
            latLngBounds: {
              north: 19.6,
              south: 19.0,
              west: -99.5,
              east: -98.8,
            },
          },
          scrollwheel: false,
        }}
      >
           <StandaloneSearchBox
          onLoad={handleOnLoad}
          onPlacesChanged={handlePlacesChanged}
          bounds={{
            north: 19.592769,
            south: 19.189365,
            west:  -99.326444,
            east:  -98.960977,
          }}
        >
          <input
            type="text"
            placeholder="Buscar ubicaciones en Ciudad de México..."
            style={{
              boxSizing: 'border-box',
              border: '1px solid transparent',
              width: '240px',
              height: '32px',
              padding: '0 12px',
              borderRadius: '3px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
              fontSize: '14px',
              outline: 'none',
              textOverflow: 'ellipses',
              position: 'absolute',
              left: '50%',
              marginLeft: '-120px',
              zIndex: '1',
            }}
          />
        </StandaloneSearchBox>
        {markerPosition && (
          <Marker
            position={markerPosition}
            draggable={true}
            onDragEnd={handleMarkerDragEnd}
          />
        )}
          <Polygon
          paths={polygon}
          options={{
            fillColor: "#FFB471", // Relleno
            fillOpacity: 0.2,
            strokeColor: "#ff9f49",// Borde
            strokeOpacity: 1,
            strokeWeight: 2,
          }}
        />
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;