-- phpMyAdmin SQL Dump
-- version 4.9.11
-- https://www.phpmyadmin.net/
--
-- Hôte : db5001933572.hosting-data.io
-- Généré le : mer. 15 jan. 2025 à 12:40
-- Version du serveur : 5.7.42-log
-- Version de PHP : 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `dbs1582075`
--

-- --------------------------------------------------------

--
-- Structure de la table `pages`
--

CREATE TABLE `pages` (
  `id` int(11) NOT NULL,
  `id_site` int(11) NOT NULL,
  `id_parent` int(11) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `titre_url` varchar(255) NOT NULL,
  `meta_title` varchar(100) NOT NULL,
  `meta_desc` text NOT NULL,
  `meta_keywords` text NOT NULL,
  `template` varchar(255) NOT NULL,
  `picto` varchar(30) NOT NULL,
  `ping` int(11) NOT NULL,
  `ordre` int(11) NOT NULL,
  `top` tinyint(1) NOT NULL,
  `off` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `pages`
--

INSERT INTO `pages` (`id`, `id_site`, `id_parent`, `titre`, `titre_url`, `meta_title`, `meta_desc`, `meta_keywords`, `template`, `picto`, `ping`, `ordre`, `top`, `off`) VALUES
(1, 1, 0, 'ACCUEIL', '', 'MonWebPro - Votre site internet professionnel', 'MonWebPro est la solution web idéale pour les Petites et Moyennes entreprises.', 'MonWebPro', 'home', '', 74212, 0, 1, 0),
(2, 1, 0, 'NOS OFFRES', 'nos-offres', 'MonWebPro - Nos offres', 'Offres MonWebPro', 'MonWebPro', 'Offres', '', 3749, 0, 1, 0),
(3, 1, 0, 'NOS RÉFÉRENCES', 'nos-references', 'MonWebPro - Nos réferences', 'MonWebPro', 'MonWebPro', 'references', '', 1, 0, 1, 0),
(4, 1, 0, 'CONTACT', 'contact', 'MonWebPro - Contactez-nous', 'MonWebPro', 'MonWebPro', 'contact', '', 194, 0, 1, 0),
(5, 1, 0, 'LOGIN', 'login', 'MonWebPro - Login', 'MonWebPro', 'MonWebPro', 'login', '', 36, 0, 0, 0),
(6, 1, 0, 'TEMOIGNAGES', 'temoignages', 'Nos clients parlent de nous...', 'Les clients MonWebPro parlent de nous: lisez leurs commentaires.', 'monwebpro,clients,references,temoins,temoignages,trust,truspilot', 'temoignages', '', 30, 0, 0, 0),
(7, 1, 0, 'REFERENCES', 'references', 'references', '', '', 'references', '', 5456, 0, 0, 0),
(8, 1, 0, '404', '404', 'Oops: cette page n\'existe pas', 'Erreur: la page que vous recherchez n\'existe pas ou a été déplacée.', '404,error', '404', '', 822, 0, 0, 0),
(9, 1, 0, 'OFFRES', 'offres', 'Les offres MonWebPro', '', '', 'offres', '', 32164, 0, 0, 0);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `pages`
--
ALTER TABLE `pages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_id_site_pages` (`id_site`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `pages`
--
ALTER TABLE `pages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=234;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `pages`
--
ALTER TABLE `pages`
  ADD CONSTRAINT `fk_id_site_pages` FOREIGN KEY (`id_site`) REFERENCES `sites` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
