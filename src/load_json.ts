/* This entire file is a hacky mess. Will need to fix. */

import anth_json from "../data/anth.json";
import art_json from "../data/art.json";
import artcs_json from "../data/artcs.json";
import arthi_json from "../data/arthi.json";
import asam_json from "../data/asam.json";
import astro_json from "../data/astro.json";
import bioe_json from "../data/bioe.json";
import biolcs_json from "../data/biolcs.json";
import blst_json from "../data/blst.json";
import bmse_json from "../data/bmse.json";
import clit_json from "../data/clit.json";
import che_json from "../data/che.json";
import chst_json from "../data/chst.json";
import chem_json from "../data/chem.json";
import chemcs_json from "../data/chemcs.json";
import chin_json from "../data/chin.json";
import class_json from "../data/class.json";
import cmpsc_json from "../data/cmpsc.json";
import cmptgcs_json from "../data/cmptgcs.json";
import cncsp_json from "../data/cncsp.json";
import comm_json from "../data/comm.json";
import dance_json from "../data/dance.json";
import dyns_json from "../data/dyns.json";
import eacs_json from "../data/eacs.json";
import earth_json from "../data/earth.json";
import ece_json from "../data/ece.json";
import econ_json from "../data/econ.json";
import ed_json from "../data/ed.json";
import ed_a_json from "../data/ed_a.json";
import ed_e_json from "../data/ed_e.json";
// import ed_hss_json from "../data/ed_hss.json";
import ed_ia_json from "../data/ed_ia.json";
import ed_l_json from "../data/ed_l.json";
import ed_la_json from "../data/ed_la.json";
import ed_m_json from "../data/ed_m.json";
import ed_r_json from "../data/ed_r.json";
import ed_s_json from "../data/ed_s.json";
import ed_st_json from "../data/ed_st.json";
import ed_wl_json from "../data/ed_wl.json";
import eds_json from "../data/eds.json";
import eemb_json from "../data/eemb.json";
import engl_json from "../data/engl.json";
import engr_json from "../data/engr.json";
import envs_json from "../data/envs.json";
import es_json from "../data/es.json";
import esm_json from "../data/esm.json";
import ess_json from "../data/ess.json";
import famst_json from "../data/famst.json";
import femst_json from "../data/femst.json";
import fr_json from "../data/fr.json";
import geog_json from "../data/geog.json";
import ger_json from "../data/ger.json";
import globl_json from "../data/globl.json";
import gps_json from "../data/gps.json";
import greek_json from "../data/greek.json";
import heb_json from "../data/heb.json";
import hist_json from "../data/hist.json";
import int_json from "../data/int.json";
import intcs_json from "../data/intcs.json";
import ital_json from "../data/ital.json";
import japan_json from "../data/japan.json";
import kor_json from "../data/kor.json";
import lais_json from "../data/lais.json";
import latin_json from "../data/latin.json";
import ling_json from "../data/ling.json";
import marincs_json from "../data/marincs.json";
import marsc_json from "../data/marsc.json";
import mat_json from "../data/mat.json";
import math_json from "../data/math.json";
import mathcs_json from "../data/mathcs.json";
import matrl_json from "../data/matrl.json";
import mcdb_json from "../data/mcdb.json";
import me_json from "../data/me.json";
import mest_json from "../data/mest.json";
import mes_json from "../data/mes.json";
import ms_json from "../data/ms.json";
import mus_json from "../data/mus.json";
import phil_json from "../data/phil.json";
import phys_json from "../data/phys.json";
import physcs_json from "../data/physcs.json";
import pols_json from "../data/pols.json";
import port_json from "../data/port.json";
import pstat_json from "../data/pstat.json";
import psy_json from "../data/psy.json";
import rgst_json from "../data/rgst.json";
import russ_json from "../data/russ.json";
import shs_json from "../data/shs.json";
import slav_json from "../data/slav.json";
import soc_json from "../data/soc.json";
import span_json from "../data/span.json";
import thtr_json from "../data/thtr.json";
import tmp_json from "../data/tmp.json";
import wlcs_json from "../data/w&lcs.json";
import writ_json from "../data/writ.json";

export default function loadJSON(dept: string = 'anth') {
    // let json = eval(dept + '_json');
    // return json;

    // warning: do not read further.
    // forgive me for my sins
    if (dept == 'anth') {
        return anth_json;
    } else if (dept == "anth") {
        return anth_json;
    } else if (dept == "art") {
        return art_json;
    } else if (dept == "artcs") {
        return artcs_json;
    } else if (dept == "arthi") {
        return arthi_json;
    } else if (dept == "asam") {
        return asam_json;
    } else if (dept == "astro") {
        return astro_json;
    } else if (dept == "bioe") {
        return bioe_json;
    } else if (dept == "biolcs") {
        return biolcs_json;
    } else if (dept == "blst") {
        return blst_json;
    } else if (dept == "bmse") {
        return bmse_json;
    } else if (dept == "clit") {
        return clit_json;
    } else if (dept == "che") {
        return che_json;
    } else if (dept == "chst") {
        return chst_json;
    } else if (dept == "chem") {
        return chem_json;
    } else if (dept == "chemcs") {
        return chemcs_json;
    } else if (dept == "chin") {
        return chin_json;
    } else if (dept == "class") {
        return class_json;
    } else if (dept == "cmpsc") {
        return cmpsc_json;
    } else if (dept == "cmptgcs") {
        return cmptgcs_json;
    } else if (dept == "cncsp") {
        return cncsp_json;
    } else if (dept == "comm") {
        return comm_json;
    } else if (dept == "dance") {
        return dance_json;
    } else if (dept == "dyns") {
        return dyns_json;
    } else if (dept == "eacs") {
        return eacs_json;
    } else if (dept == "earth") {
        return earth_json;
    } else if (dept == "ece") {
        return ece_json;
    } else if (dept == "econ") {
        return econ_json;
    } else if (dept == "ed") {
        return ed_json;
    } else if (dept == "ed_a") {
        return ed_a_json;
    } else if (dept == "ed_e") {
        return ed_e_json;
    // } else if (dept == "ed_hss") {
    //     return ed_hss_json;
    } else if (dept == "ed_ia") {
        return ed_ia_json;
    } else if (dept == "ed_l") {
        return ed_l_json;
    } else if (dept == "ed_la") {
        return ed_la_json;
    } else if (dept == "ed_m") {
        return ed_m_json;
    } else if (dept == "ed_r") {
        return ed_r_json;
    } else if (dept == "ed_s") {
        return ed_s_json;
    } else if (dept == "ed_st") {
        return ed_st_json;
    } else if (dept == "ed_wl") {
        return ed_wl_json;
    } else if (dept == "eds") {
        return eds_json;
    } else if (dept == "eemb") {
        return eemb_json;
    } else if (dept == "engl") {
        return engl_json;
    } else if (dept == "engr") {
        return engr_json;
    } else if (dept == "envs") {
        return envs_json;
    } else if (dept == "es") {
        return es_json;
    } else if (dept == "esm") {
        return esm_json;
    } else if (dept == "ess") {
        return ess_json;
    } else if (dept == "famst") {
        return famst_json;
    } else if (dept == "femst") {
        return femst_json;
    } else if (dept == "fr") {
        return fr_json;
    } else if (dept == "geog") {
        return geog_json;
    } else if (dept == "ger") {
        return ger_json;
    } else if (dept == "globl") {
        return globl_json;
    } else if (dept == "gps") {
        return gps_json;
    } else if (dept == "greek") {
        return greek_json;
    } else if (dept == "heb") {
        return heb_json;
    } else if (dept == "hist") {
        return hist_json;
    } else if (dept == "int") {
        return int_json;
    } else if (dept == "intcs") {
        return intcs_json;
    } else if (dept == "ital") {
        return ital_json;
    } else if (dept == "japan") {
        return japan_json;
    } else if (dept == "kor") {
        return kor_json;
    } else if (dept == "lais") {
        return lais_json;
    } else if (dept == "latin") {
        return latin_json;
    } else if (dept == "ling") {
        return ling_json;
    } else if (dept == "marincs") {
        return marincs_json;
    } else if (dept == "marsc") {
        return marsc_json;
    } else if (dept == "mat") {
        return mat_json;
    } else if (dept == "math") {
        return math_json;
    } else if (dept == "mathcs") {
        return mathcs_json;
    } else if (dept == "matrl") {
        return matrl_json;
    } else if (dept == "mcdb") {
        return mcdb_json;
    } else if (dept == "me") {
        return me_json;
    } else if (dept == "mest") {
        return mest_json;
    } else if (dept == "mes") {
        return mes_json;
    } else if (dept == "ms") {
        return ms_json;
    } else if (dept == "mus") {
        return mus_json;
    } else if (dept == "phil") {
        return phil_json;
    } else if (dept == "phys") {
        return phys_json;
    } else if (dept == "physcs") {
        return physcs_json;
    } else if (dept == "pols") {
        return pols_json;
    } else if (dept == "port") {
        return port_json;
    } else if (dept == "pstat") {
        return pstat_json;
    } else if (dept == "psy") {
        return psy_json;
    } else if (dept == "rgst") {
        return rgst_json;
    } else if (dept == "russ") {
        return russ_json;
    } else if (dept == "shs") {
        return shs_json;
    } else if (dept == "slav") {
        return slav_json;
    } else if (dept == "soc") {
        return soc_json;
    } else if (dept == "span") {
        return span_json;
    } else if (dept == "thtr") {
        return thtr_json;
    } else if (dept == "tmp") {
        return tmp_json;
    } else if (dept == "w&lcs") {
        return wlcs_json;
    } else if (dept == "writ") {
        return writ_json;
    }
}
